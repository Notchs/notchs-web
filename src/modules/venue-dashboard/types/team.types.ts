export type MemberRole = "Owner" | "Manager" | "Employee" | "Support";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: "Active" | "Invited";
  lastActive: string;
  isYou: boolean;
};

export type RolePermission = {
  label: string;
  owner: boolean;
  manager: boolean;
  employee: boolean;
  support: boolean;
};

export type TeamResponse = {
  /** False while each venue has a single owner login. */
  enabled: boolean;
  members: TeamMember[];
  permissions: RolePermission[];
};
