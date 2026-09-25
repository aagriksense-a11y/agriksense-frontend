export type UserRole = "FARMER" | "DATA_COLLECTION_OFFICER" | "ORGANIZATION" | "ADMIN";

export type ProfileType = "farmer" | "dco" | "organization";

export interface SessionProfile {
  type: ProfileType;
  firstName?: string;
  lastName?: string;
  otherName?: string;
  orgName?: string;
  consentAccepted?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Shape persisted in localStorage on login/signup (the API `data` payload). */
export interface SessionUser extends Partial<AuthTokens> {
  id?: string;
  platformId?: string;
  role: UserRole;
  email?: string | null;
  phoneNumber?: string | null;
  onboardingStep?: string;
  profile?: SessionProfile | null;
}

export type UserRoleKey = "farmer" | "dco" | "organization";

export const ROLE_SIGNUP_PATH: Record<UserRoleKey, string> = {
  farmer: "/api/auth/signup/farmer",
  dco: "/api/auth/signup/dco",
  organization: "/api/auth/signup/organization",
};

/** Landing page for each role; ADMIN stays where it is. */
export const ROLE_HOME: Record<UserRole, string | null> = {
  ADMIN: null,
  FARMER: "/farmer-dashboard",
  DATA_COLLECTION_OFFICER: "/dco-dashboard",
  ORGANIZATION: "/org-dashboard",
};
