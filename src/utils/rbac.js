const USER_ROLES = {
  SUPPORT: "SUPPORT",
  ADMIN: "ADMIN",
  LEVEL1: "LEVEL1",
  LEVEL2: "LEVEL2",
};

export const ALL_PERMISSIONS_OBJ = {
  VIEW_DASHBOARD_PAGE: "VIEW_DASHBOARD_PAGE",
  CREATE_USER: "CREATE_USER",
  CREATE_CATEGORY: "CREATE_CATEGORY",

  VIEW_USERS_PAGE: "VIEW_USERS_PAGE",
  READ_USER: "READ_USER",
  READ_CATEGORY: "READ_CATEGORY",

  VIEW_USER_PAGE: "VIEW_USER_PAGE",
  UPDATE_USER: "UPDATE_USER",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",

  VIEW_CATEGORY_PAGE: "VIEW_CATEGORY_PAGE",
  DELETE_USER: "DELETE_USER",
  CREATE_AD: "CREATE_AD",

  UPDATE_PERMISSIONS: "UPDATE_PERMISSIONS",
  READ_AD: "READ_AD",
  DELETE_CATEGORY: "DELETE_CATEGORY",

  CREATE_EMPLOYEE: "CREATE_EMPLOYEE",
  UPDATE_AD: "UPDATE_AD",
  DELETE_AD: "DELETE_AD",
};

export const ALL_PERMISSIONS_ARRAY = Object.values(ALL_PERMISSIONS_OBJ);
export const USER_ROLES_LIST = Object.values(USER_ROLES);

const PREDFINED_PERMISSIONS_BY_ROLE = {
  [USER_ROLES.ADMIN]: ALL_PERMISSIONS_ARRAY,
  [USER_ROLES.LEVEL1]: [
    ALL_PERMISSIONS_OBJ.VIEW_USERS_PAGE,
    ALL_PERMISSIONS_OBJ.VIEW_USER_PAGE,
    ALL_PERMISSIONS_OBJ.READ_AD,
    ALL_PERMISSIONS_OBJ.CREATE_AD,
    ALL_PERMISSIONS_OBJ.UPDATE_AD,
    ALL_PERMISSIONS_OBJ.READ_USER,
    ALL_PERMISSIONS_OBJ.UPDATE_USER,
    ALL_PERMISSIONS_OBJ.CREATE_USER,
  ],
  [USER_ROLES.LEVEL2]: [
    ALL_PERMISSIONS_OBJ.VIEW_USERS_PAGE,
    ALL_PERMISSIONS_OBJ.VIEW_DASHBOARD_PAGE,
    ALL_PERMISSIONS_OBJ.READ_AD,
    ALL_PERMISSIONS_OBJ.UPDATE_AD,
    ALL_PERMISSIONS_OBJ.CREATE_AD,
    ALL_PERMISSIONS_OBJ.DELETE_AD,
    ALL_PERMISSIONS_OBJ.READ_USER,
    ALL_PERMISSIONS_OBJ.UPDATE_USER,
    ALL_PERMISSIONS_OBJ.CREATE_USER,
    ALL_PERMISSIONS_OBJ.DELETE_USER,
  ],
  [USER_ROLES.SUPPORT]: [
    ALL_PERMISSIONS_OBJ.VIEW_USERS_PAGE,
    ALL_PERMISSIONS_OBJ.READ_AD,
    ALL_PERMISSIONS_OBJ.UPDATE_AD,
    ALL_PERMISSIONS_OBJ.CREATE_AD,
    ALL_PERMISSIONS_OBJ.DELETE_AD,
    ALL_PERMISSIONS_OBJ.READ_USER,
    ALL_PERMISSIONS_OBJ.UPDATE_USER,
    ALL_PERMISSIONS_OBJ.CREATE_USER,
    ALL_PERMISSIONS_OBJ.DELETE_USER,
  ],
};

export function getPredefinedPermissionsByRole(role) {
  return PREDFINED_PERMISSIONS_BY_ROLE[role] || [];
}

let currPerms = [];

export function setPermissions(perms) {
  currPerms = perms;
}

export function userCan(action, fn) {
  const isAllowed = currPerms.includes(action);

  return isAllowed && fn ? fn() : isAllowed;
}
