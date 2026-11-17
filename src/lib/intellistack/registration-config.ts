import { z } from "zod";

/**
 * Registration forms are data, not markup: a future Global Administrator screen can
 * edit these definitions without redesigning the login page.
 */

export type AccountType =
  | "employee"
  | "contractor"
  | "intellistaff"
  | "intellihire"
  | "intelliwork"
  | "tenant";

export type FieldType = "text" | "email" | "tel" | "url" | "password" | "select" | "textarea" | "checkbox";

export type RegistrationField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  maxLength?: number;
  /** Full-width in the two-column grid. */
  wide?: boolean;
  /** Only shown (and validated) when another field has one of these values. */
  showWhen?: { field: string; equals: string[] };
  /** Pattern check with its error message. */
  pattern?: { regex: RegExp; message: string };
  hint?: string;
};

export type RegistrationSection = { title: string; fields: RegistrationField[] };

export type RegistrationKindId = "employee" | "intellistaff" | "intellihire" | "intelliwork" | "tenant";

export type RegistrationConfig = {
  id: RegistrationKindId;
  title: string;
  intro: string;
  submitLabel: string;
  sections: RegistrationSection[];
  /** Field names that map onto the stored registration record. */
  map: {
    email: string;
    phone?: string;
    displayName: (v: Record<string, string>) => string;
    organizationName?: (v: Record<string, string>) => string | undefined;
  };
  accountTypeFor: (values: Record<string, string>) => AccountType;
  nextSteps: (accountType: AccountType) => string[];
};

/** Account types that need an administrator to approve them after email verification. Mirrors public.account_type_requires_approval. */
export const APPROVAL_REQUIRED: Record<AccountType, boolean> = {
  employee: true,
  contractor: true,
  intellistaff: false,
  intellihire: true,
  intelliwork: false,
  tenant: true,
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  employee: "IntelliStack Employee",
  contractor: "IntelliStack Contractor",
  intellistaff: "IntelliStaff Individual",
  intellihire: "IntelliHire Business",
  intelliwork: "IntelliWork User",
  tenant: "Tenant",
};

export const PHONE_REGEX = /^\+?[0-9][0-9\s().-]{6,19}$/;
export const PASSWORD_RULE = {
  regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,72}$/,
  message: "Use at least 10 characters with an uppercase letter, a lowercase letter and a number.",
};

const passwordFields: RegistrationField[] = [
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    pattern: PASSWORD_RULE,
    hint: "At least 10 characters, with upper and lowercase letters and a number.",
  },
  { name: "confirmPassword", label: "Confirm password", type: "password", required: true },
];

const consentFields = (extra: RegistrationField[] = []): RegistrationField[] => [
  ...extra,
  {
    name: "acceptTerms",
    label: "I agree to the Terms of Service and Privacy Policy.",
    type: "checkbox",
    required: true,
    wide: true,
  },
];

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Mexico",
  "Brazil",
  "Japan",
  "Singapore",
  "South Africa",
  "United Arab Emirates",
  "Other",
];

const TIME_ZONES = [
  "UTC−08:00 Pacific",
  "UTC−07:00 Mountain",
  "UTC−06:00 Central",
  "UTC−05:00 Eastern",
  "UTC±00:00 London",
  "UTC+01:00 Central Europe",
  "UTC+04:00 Gulf",
  "UTC+05:30 India",
  "UTC+08:00 Singapore",
  "UTC+09:00 Tokyo",
  "UTC+10:00 Sydney",
];

const approvalSteps = (who: string) => [
  "Open the confirmation email we just sent and verify your address.",
  `${who} will review your registration. Your account stays in “Pending approval” until then.`,
  "You'll be able to sign in to the Maximus Optimus platform as soon as you're approved.",
];

const selfServeSteps = [
  "Open the confirmation email we just sent and verify your address.",
  "Your account becomes active as soon as your email is verified.",
  "Come back here and sign in with your email and password.",
];

export const REGISTRATION_CONFIGS: Record<RegistrationKindId, RegistrationConfig> = {
  employee: {
    id: "employee",
    title: "IntelliStack Employee / Contractor Registration",
    intro:
      "Request corporate access. Registration does not grant any corporate privileges — an IntelliStack administrator verifies and approves every request.",
    submitLabel: "Request corporate access",
    sections: [
      {
        title: "Relationship",
        fields: [
          {
            name: "relationship",
            label: "I am an",
            type: "select",
            required: true,
            options: ["IntelliStack Employee", "Authorized Contractor"],
          },
          { name: "personnelId", label: "Employee or contractor ID", type: "text", required: true, maxLength: 40 },
          {
            name: "contractingCompany",
            label: "Contracting company",
            type: "text",
            required: true,
            maxLength: 150,
            showWhen: { field: "relationship", equals: ["Authorized Contractor"] },
          },
          {
            name: "contractEndDate",
            label: "Contract end date",
            type: "text",
            placeholder: "YYYY-MM-DD",
            pattern: { regex: /^\d{4}-\d{2}-\d{2}$/, message: "Use the format YYYY-MM-DD." },
            showWhen: { field: "relationship", equals: ["Authorized Contractor"] },
          },
        ],
      },
      {
        title: "About you",
        fields: [
          { name: "firstName", label: "First name", type: "text", required: true, maxLength: 80 },
          { name: "lastName", label: "Last name", type: "text", required: true, maxLength: 80 },
          { name: "email", label: "Work email", type: "email", required: true },
          { name: "phone", label: "Work phone", type: "tel", required: true },
          { name: "department", label: "Department", type: "text", required: true, maxLength: 100 },
          { name: "officeLocation", label: "Office location", type: "text", maxLength: 100 },
        ],
      },
      {
        title: "Approving manager or sponsor",
        fields: [
          { name: "managerName", label: "Manager / sponsor name", type: "text", required: true, maxLength: 120 },
          { name: "managerEmail", label: "Manager / sponsor email", type: "email", required: true },
        ],
      },
      { title: "Security", fields: passwordFields },
      {
        title: "Agreements",
        fields: consentFields([
          {
            name: "acceptAcceptableUse",
            label: "I have read and will follow the Acceptable Use Policy.",
            type: "checkbox",
            required: true,
            wide: true,
          },
        ]),
      },
    ],
    map: {
      email: "email",
      phone: "phone",
      displayName: (v) => `${v["firstName"]} ${v["lastName"]}`.trim(),
      organizationName: (v) => (v["relationship"] === "Authorized Contractor" ? v["contractingCompany"] : "IntelliStack Systems"),
    },
    accountTypeFor: (v) => (v["relationship"] === "Authorized Contractor" ? "contractor" : "employee"),
    nextSteps: () => approvalSteps("An IntelliStack administrator and your manager or sponsor"),
  },

  intellistaff: {
    id: "intellistaff",
    title: "IntelliStaff Individual Registration",
    intro: "Create your personal IntelliStaff account to find work, apply for roles, and manage assignments.",
    submitLabel: "Create my IntelliStaff account",
    sections: [
      {
        title: "About you",
        fields: [
          { name: "firstName", label: "First name", type: "text", required: true, maxLength: 80 },
          { name: "lastName", label: "Last name", type: "text", required: true, maxLength: 80 },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Mobile phone", type: "tel", required: true },
          { name: "city", label: "City", type: "text", required: true, maxLength: 100 },
          { name: "country", label: "Country", type: "select", required: true, options: COUNTRIES },
        ],
      },
      {
        title: "What you're looking for",
        fields: [
          { name: "desiredRole", label: "Desired job title or field", type: "text", required: true, maxLength: 120 },
          {
            name: "employmentType",
            label: "Preferred work type",
            type: "select",
            required: true,
            options: ["Full-time", "Part-time", "Temporary", "Contract", "Open to anything"],
          },
          {
            name: "experienceLevel",
            label: "Experience level",
            type: "select",
            options: ["Entry level", "1–3 years", "3–7 years", "7+ years"],
          },
          { name: "availability", label: "Available from", type: "text", placeholder: "e.g. Immediately", maxLength: 60 },
        ],
      },
      { title: "Security", fields: passwordFields },
      {
        title: "Agreements",
        fields: consentFields([
          { name: "jobAlerts", label: "Email me job matches and alerts.", type: "checkbox", wide: true },
        ]),
      },
    ],
    map: {
      email: "email",
      phone: "phone",
      displayName: (v) => `${v["firstName"]} ${v["lastName"]}`.trim(),
    },
    accountTypeFor: () => "intellistaff",
    nextSteps: () => selfServeSteps,
  },

  intellihire: {
    id: "intellihire",
    title: "IntelliHire Business Registration",
    intro: "Register your company or organization to hire through IntelliHire. Business details are verified before hiring tools are unlocked.",
    submitLabel: "Register my business",
    sections: [
      {
        title: "Business",
        fields: [
          { name: "companyName", label: "Legal business name", type: "text", required: true, maxLength: 150, wide: true },
          {
            name: "industry",
            label: "Industry",
            type: "select",
            required: true,
            options: [
              "Technology",
              "Healthcare",
              "Manufacturing",
              "Retail",
              "Logistics",
              "Finance",
              "Hospitality",
              "Construction",
              "Education",
              "Government",
              "Other",
            ],
          },
          {
            name: "companySize",
            label: "Company size",
            type: "select",
            required: true,
            options: ["1–10", "11–50", "51–200", "201–1,000", "1,001–5,000", "5,000+"],
          },
          {
            name: "website",
            label: "Company website",
            type: "url",
            placeholder: "https://",
            pattern: { regex: /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i, message: "Enter a full web address starting with https://" },
          },
          { name: "businessPhone", label: "Business phone", type: "tel", required: true },
        ],
      },
      {
        title: "Business address",
        fields: [
          { name: "street", label: "Street address", type: "text", required: true, maxLength: 150, wide: true },
          { name: "city", label: "City", type: "text", required: true, maxLength: 100 },
          { name: "region", label: "State / region", type: "text", required: true, maxLength: 100 },
          { name: "postalCode", label: "Postal code", type: "text", required: true, maxLength: 20 },
          { name: "country", label: "Country", type: "select", required: true, options: COUNTRIES },
        ],
      },
      {
        title: "Primary hiring contact",
        fields: [
          { name: "firstName", label: "First name", type: "text", required: true, maxLength: 80 },
          { name: "lastName", label: "Last name", type: "text", required: true, maxLength: 80 },
          { name: "jobTitle", label: "Job title", type: "text", required: true, maxLength: 100 },
          { name: "email", label: "Work email", type: "email", required: true },
          {
            name: "hiringNeeds",
            label: "Hiring needs (optional)",
            type: "textarea",
            maxLength: 1000,
            wide: true,
            placeholder: "Roles, volumes, locations…",
          },
        ],
      },
      { title: "Security", fields: passwordFields },
      {
        title: "Agreements",
        fields: consentFields([
          {
            name: "authorizedRepresentative",
            label: "I am authorized to register this business with IntelliHire.",
            type: "checkbox",
            required: true,
            wide: true,
          },
        ]),
      },
    ],
    map: {
      email: "email",
      phone: "businessPhone",
      displayName: (v) => `${v["firstName"]} ${v["lastName"]}`.trim(),
      organizationName: (v) => v["companyName"],
    },
    accountTypeFor: () => "intellihire",
    nextSteps: () => approvalSteps("The IntelliHire verification team"),
  },

  intelliwork: {
    id: "intelliwork",
    title: "IntelliWork Registration",
    intro: "Set up your IntelliWork account to bring your tasks, projects, and workspaces together.",
    submitLabel: "Create my IntelliWork account",
    sections: [
      {
        title: "Account type",
        fields: [
          {
            name: "workRole",
            label: "I'm joining as",
            type: "select",
            required: true,
            options: ["Independent professional", "Team member of an organization", "Project or team lead"],
          },
          {
            name: "organization",
            label: "Organization",
            type: "text",
            required: true,
            maxLength: 150,
            showWhen: { field: "workRole", equals: ["Team member of an organization", "Project or team lead"] },
          },
          {
            name: "invitationCode",
            label: "Invitation code (if you have one)",
            type: "text",
            maxLength: 40,
            showWhen: { field: "workRole", equals: ["Team member of an organization"] },
          },
        ],
      },
      {
        title: "About you",
        fields: [
          { name: "fullName", label: "Full name", type: "text", required: true, maxLength: 150 },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone (optional)", type: "tel" },
          { name: "timeZone", label: "Time zone", type: "select", required: true, options: TIME_ZONES },
          {
            name: "workArea",
            label: "Primary work area",
            type: "select",
            required: true,
            options: ["Operations", "Engineering", "Design", "Sales & marketing", "Finance", "Customer support", "Other"],
          },
        ],
      },
      { title: "Security", fields: passwordFields },
      { title: "Agreements", fields: consentFields() },
    ],
    map: {
      email: "email",
      phone: "phone",
      displayName: (v) => v["fullName"] ?? "",
      organizationName: (v) => v["organization"] || undefined,
    },
    accountTypeFor: () => "intelliwork",
    nextSteps: () => selfServeSteps,
  },

  tenant: {
    id: "tenant",
    title: "Tenant Registration",
    intro:
      "Establish your organization's IntelliStack tenant. Tenant details are verified and approved before the tenant is provisioned.",
    submitLabel: "Request my tenant",
    sections: [
      {
        title: "Organization",
        fields: [
          { name: "organizationName", label: "Organization name", type: "text", required: true, maxLength: 150, wide: true },
          {
            name: "tenantType",
            label: "Organization type",
            type: "select",
            required: true,
            options: ["Enterprise", "Small or mid-size business", "Nonprofit", "Government", "Education", "Healthcare"],
          },
          {
            name: "tenantIdentifier",
            label: "Requested tenant ID",
            type: "text",
            required: true,
            placeholder: "e.g. acme-global",
            pattern: {
              regex: /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/,
              message: "3–40 lowercase letters, numbers or dashes, not starting or ending with a dash.",
            },
          },
          { name: "country", label: "Country", type: "select", required: true, options: COUNTRIES },
          {
            name: "expectedUsers",
            label: "Expected users",
            type: "select",
            required: true,
            options: ["1–25", "26–100", "101–500", "501–2,500", "2,500+"],
          },
        ],
      },
      {
        title: "Tenant administrator",
        fields: [
          { name: "firstName", label: "First name", type: "text", required: true, maxLength: 80 },
          { name: "lastName", label: "Last name", type: "text", required: true, maxLength: 80 },
          { name: "adminTitle", label: "Job title", type: "text", required: true, maxLength: 100 },
          { name: "email", label: "Administrator email", type: "email", required: true },
          { name: "phone", label: "Administrator phone", type: "tel", required: true },
          { name: "billingEmail", label: "Billing contact email (optional)", type: "email" },
        ],
      },
      { title: "Security", fields: passwordFields },
      {
        title: "Agreements",
        fields: consentFields([
          {
            name: "authorizedOrganization",
            label: "I am authorized to create a tenant on behalf of this organization.",
            type: "checkbox",
            required: true,
            wide: true,
          },
        ]),
      },
    ],
    map: {
      email: "email",
      phone: "phone",
      displayName: (v) => `${v["firstName"]} ${v["lastName"]}`.trim(),
      organizationName: (v) => v["organizationName"],
    },
    accountTypeFor: () => "tenant",
    nextSteps: () => approvalSteps("The IntelliStack tenant onboarding team"),
  },
};

export function isFieldVisible(field: RegistrationField, values: Record<string, string>) {
  if (!field.showWhen) return true;
  return field.showWhen.equals.includes(values[field.showWhen.field] ?? "");
}

export function allFields(config: RegistrationConfig) {
  return config.sections.flatMap((s) => s.fields);
}

/** Validates a filled registration form. Returns field -> message for each problem. */
export function validateRegistration(config: RegistrationConfig, values: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const field of allFields(config)) {
    if (!isFieldVisible(field, values)) continue;
    const raw = (values[field.name] ?? "").trim();
    if (field.type === "checkbox") {
      if (field.required && raw !== "true") errors[field.name] = "This confirmation is required.";
      continue;
    }
    if (!raw) {
      if (field.required) errors[field.name] = `${field.label.replace(/ \(optional\)$/, "")} is required.`;
      continue;
    }
    if (field.maxLength && raw.length > field.maxLength) {
      errors[field.name] = `Keep this under ${field.maxLength} characters.`;
      continue;
    }
    if (field.type === "email" && !z.string().email().max(255).safeParse(raw).success) {
      errors[field.name] = "Enter a valid email address.";
      continue;
    }
    if (field.type === "tel" && !PHONE_REGEX.test(raw)) {
      errors[field.name] = "Enter a valid phone number, including country code.";
      continue;
    }
    if (field.type === "select" && field.options && !field.options.includes(raw)) {
      errors[field.name] = "Choose one of the options.";
      continue;
    }
    if (field.pattern && !field.pattern.regex.test(raw)) {
      errors[field.name] = field.pattern.message;
    }
  }
  if (values["password"] && values["confirmPassword"] !== undefined && values["password"] !== values["confirmPassword"]) {
    errors["confirmPassword"] = "Passwords don't match.";
  }
  return errors;
}

const SECRET_FIELDS = new Set(["password", "confirmPassword"]);

/** Builds the sign-up payload. Passwords never go into stored details. */
export function buildSignUpPayload(config: RegistrationConfig, values: Record<string, string>) {
  const details: Record<string, string | boolean> = {};
  for (const field of allFields(config)) {
    if (SECRET_FIELDS.has(field.name) || !isFieldVisible(field, values)) continue;
    const v = (values[field.name] ?? "").trim();
    if (field.type === "checkbox") details[field.name] = v === "true";
    else if (v) details[field.name] = v;
  }
  details["consentedAt"] = new Date().toISOString();
  const accountType = config.accountTypeFor(values);
  return {
    email: (values[config.map.email] ?? "").trim().toLowerCase(),
    password: values["password"] ?? "",
    accountType,
    metadata: {
      account_type: accountType,
      display_name: config.map.displayName(values),
      organization_name: config.map.organizationName?.(values) ?? null,
      phone: config.map.phone ? values[config.map.phone]?.trim() || null : null,
      registration_kind: config.id,
      details,
    },
  };
}
