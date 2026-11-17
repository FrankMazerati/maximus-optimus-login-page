CREATE TYPE public.account_type AS ENUM ('employee','contractor','intellistaff','intellihire','intelliwork','tenant');
CREATE TYPE public.account_status AS ENUM ('pending_email_verification','pending_approval','active','rejected','suspended');
CREATE TYPE public.app_role AS ENUM ('global_admin','approver');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Global admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'global_admin'));

CREATE OR REPLACE FUNCTION public.account_type_requires_approval(_type public.account_type)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT _type IN ('employee','contractor','intellihire','tenant')
$$;

CREATE TABLE public.account_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  account_type public.account_type NOT NULL,
  status public.account_status NOT NULL DEFAULT 'pending_email_verification',
  email text,
  phone text,
  display_name text,
  organization_name text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT details_is_object CHECK (jsonb_typeof(details) = 'object'),
  CONSTRAINT details_size CHECK (pg_column_size(details) < 16384)
);
GRANT SELECT, UPDATE ON public.account_registrations TO authenticated;
GRANT ALL ON public.account_registrations TO service_role;
ALTER TABLE public.account_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own registration" ON public.account_registrations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins and approvers can read all registrations" ON public.account_registrations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'global_admin') OR public.has_role(auth.uid(), 'approver'));
CREATE POLICY "Admins and approvers can review registrations" ON public.account_registrations
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'global_admin') OR public.has_role(auth.uid(), 'approver'))
  WITH CHECK (public.has_role(auth.uid(), 'global_admin') OR public.has_role(auth.uid(), 'approver'));

CREATE INDEX account_registrations_status_idx ON public.account_registrations (status);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER account_registrations_touch BEFORE UPDATE ON public.account_registrations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Create the registration row from sign-up metadata. Status is always decided here, never by the client.
CREATE OR REPLACE FUNCTION public.handle_new_registration()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  raw_type text := meta->>'account_type';
  acct public.account_type;
  det jsonb := meta->'details';
BEGIN
  IF raw_type IS NULL OR raw_type NOT IN ('employee','contractor','intellistaff','intellihire','intelliwork','tenant') THEN
    RETURN NEW;
  END IF;
  acct := raw_type::public.account_type;
  IF det IS NULL OR jsonb_typeof(det) <> 'object' OR pg_column_size(det) >= 16384 THEN
    det := '{}'::jsonb;
  END IF;
  INSERT INTO public.account_registrations (user_id, account_type, status, email, phone, display_name, organization_name, details)
  VALUES (
    NEW.id, acct,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL AND NOT public.account_type_requires_approval(acct) THEN 'active'::public.account_status
         WHEN NEW.email_confirmed_at IS NOT NULL THEN 'pending_approval'::public.account_status
         ELSE 'pending_email_verification'::public.account_status END,
    NEW.email,
    left(meta->>'phone', 32),
    left(meta->>'display_name', 200),
    left(meta->>'organization_name', 200),
    det
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created_registration
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_registration();

-- After email confirmation, move the account to its next stage.
CREATE OR REPLACE FUNCTION public.handle_registration_email_confirmed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.account_registrations
       SET status = CASE WHEN public.account_type_requires_approval(account_type)
                         THEN 'pending_approval'::public.account_status
                         ELSE 'active'::public.account_status END
     WHERE user_id = NEW.id AND status = 'pending_email_verification';
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_email_confirmed_registration
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_registration_email_confirmed();