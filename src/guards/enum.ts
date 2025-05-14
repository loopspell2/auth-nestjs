export const enum Permission {
  // User Management
  CREATE_USER = 'create_user',
  DELETE_USER = 'delete_user',
  EDIT_USER = 'edit_user',
  VIEW_USER = 'view_user',
  ASSIGN_ROLES = 'assign_roles',

  // Reporting
  VIEW_REPORTS = 'view_reports',
  GENERATE_REPORTS = 'generate_reports',

  // Organization Management
  MANAGE_ORG = 'manage_org',
  VIEW_ORG = 'view_org',
}

export const PermissionGroups = {
  UserManagement: [
    Permission.CREATE_USER,
    Permission.DELETE_USER,
    Permission.EDIT_USER,
    Permission.VIEW_USER,
    Permission.ASSIGN_ROLES,
  ],
  Reporting: [Permission.VIEW_REPORTS, Permission.GENERATE_REPORTS],
  OrgManagement: [Permission.MANAGE_ORG, Permission.VIEW_ORG],
};

export const RolePermissions = {
  SuperAdmin: [
    ...PermissionGroups.UserManagement,
    ...PermissionGroups.Reporting,
    ...PermissionGroups.OrgManagement,
  ],
  Admin: [
    ...PermissionGroups.UserManagement,
    ...PermissionGroups.OrgManagement,
  ],
  Manager: [
    Permission.VIEW_USER,
    Permission.EDIT_USER,
    Permission.VIEW_REPORTS,
  ],
  User: [Permission.VIEW_USER],
  Viewer: [Permission.VIEW_REPORTS],
};
