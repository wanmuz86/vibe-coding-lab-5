export type UserRole = "USER" | "AGENT";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
