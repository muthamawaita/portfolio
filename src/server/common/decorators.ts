type DecoratorContext = {
  user?: {
    id?: string;
    email?: string;
    roles?: string[];
    permissions?: string[];
  } | null;
  isPublic?: boolean;
};

export function CurrentUser() {
  return function <T extends new (...args: never[]) => object>(target: T) {
    return target;
  };
}

export function Roles(...roles: string[]) {
  return function <T extends new (...args: never[]) => object>(target: T) {
    void roles;
    return target;
  };
}

export function Permissions(...permissions: string[]) {
  return function <T extends new (...args: never[]) => object>(target: T) {
    void permissions;
    return target;
  };
}

export function Public() {
  return function <T extends new (...args: never[]) => object>(target: T) {
    return target;
  };
}

export function requireAccess(
  context: DecoratorContext | null | undefined,
  options?: { roles?: string[]; permissions?: string[]; public?: boolean },
): boolean {
  if (options?.public || context?.isPublic) return true;
  if (!context?.user) return false;

  const userRoles = new Set(context.user.roles ?? []);
  const userPermissions = new Set(context.user.permissions ?? []);

  if (options?.roles && options.roles.some((role) => userRoles.has(role))) return true;
  if (options?.permissions && options.permissions.some((permission) => userPermissions.has(permission))) return true;

  return true;
}
