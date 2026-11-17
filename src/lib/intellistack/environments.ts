import type { AccountType } from "./registration-config";

export type EnvironmentId = "blue" | "purple" | "green";
export type PlatformId = "intellistaff" | "intellihire" | "intelliwork";

/** The registration experience that a Sign Up button opens. */
export type RegistrationKind = "employee" | PlatformId | "tenant";

export type LoginContext = {
  heading: string;
  description: string;
  signUpLabel: string;
  registration: RegistrationKind;
  /** Account types allowed to sign in from this context. */
  accountTypes: AccountType[];
  phoneSupported: boolean;
  helpNote: string;
};

export const ENVIRONMENTS: Record<
  EnvironmentId,
  { id: EnvironmentId; name: string; description: string; themeName: string }
> = {
  blue: {
    id: "blue",
    name: "IntelliStack Employee / Contractor",
    description: "Corporate employee and contractor access.",
    themeName: "Deep Dark Blue",
  },
  purple: {
    id: "purple",
    name: "Business / Employer",
    description: "Business, employer, and IntelliStack business-platform access.",
    themeName: "Deep Dark Purple",
  },
  green: {
    id: "green",
    name: "Tenant",
    description: "Tenant-specific organizational access.",
    themeName: "Deep Dark Green",
  },
};

export const ENVIRONMENT_ORDER: EnvironmentId[] = ["blue", "purple", "green"];

export const PLATFORMS: Record<PlatformId, { id: PlatformId; name: string; tagline: string }> = {
  intellistaff: { id: "intellistaff", name: "IntelliStaff", tagline: "Job seekers & staff" },
  intellihire: { id: "intellihire", name: "IntelliHire", tagline: "Employers & organizations" },
  intelliwork: { id: "intelliwork", name: "IntelliWork", tagline: "Workspace & projects" },
};

export const PLATFORM_ORDER: PlatformId[] = ["intellistaff", "intellihire", "intelliwork"];

const PLATFORM_CONTEXTS: Record<PlatformId, LoginContext> = {
  intellistaff: {
    heading: "IntelliStaff Sign-In",
    description:
      "For individuals seeking employment. Sign in to manage your profile, applications, and assignments.",
    signUpLabel: "New User? Sign Up",
    registration: "intellistaff",
    accountTypes: ["intellistaff"],
    phoneSupported: true,
    helpNote: "Job seekers can reset their own password or ask Help Buddy for guidance.",
  },
  intellihire: {
    heading: "IntelliHire Business Sign-In",
    description:
      "For companies, employers, and organizations. Sign in to post roles, review candidates, and manage hiring.",
    signUpLabel: "New Business User? Register Business",
    registration: "intellihire",
    accountTypes: ["intellihire"],
    phoneSupported: true,
    helpNote: "Business accounts are verified by IntelliStack before hiring tools are unlocked.",
  },
  intelliwork: {
    heading: "IntelliWork Sign-In",
    description:
      "For professionals and teams working on IntelliWork. Sign in to reach your tasks, projects, and workspaces.",
    signUpLabel: "New User? Register",
    registration: "intelliwork",
    accountTypes: ["intelliwork"],
    phoneSupported: true,
    helpNote: "If you were invited by an organization, use the email address the invitation was sent to.",
  },
};

export function getLoginContext(env: EnvironmentId, platform: PlatformId): LoginContext {
  if (env === "purple") return PLATFORM_CONTEXTS[platform];
  if (env === "green") {
    return {
      heading: "Tenant Sign-In",
      description: "Tenant-specific organizational access for your organization's IntelliStack tenant.",
      signUpLabel: "New Tenant User? Register",
      registration: "tenant",
      accountTypes: ["tenant"],
      phoneSupported: true,
      helpNote: "Tenant administrators can reset access for members of their organization.",
    };
  }
  return {
    heading: "Employee & Contractor Sign-In",
    description: "Corporate access for IntelliStack employees and authorized contractors.",
    signUpLabel: "New User? Register",
    registration: "employee",
    accountTypes: ["employee", "contractor"],
    phoneSupported: true,
    helpNote: "Corporate accounts are approved by an IntelliStack administrator before access is granted.",
  };
}

/** Which environment/platform an account type belongs to (used to theme the account page). */
export function environmentForAccountType(type: AccountType): {
  env: EnvironmentId;
  platform?: PlatformId;
} {
  if (type === "employee" || type === "contractor") return { env: "blue" };
  if (type === "tenant") return { env: "green" };
  return { env: "purple", platform: type };
}
