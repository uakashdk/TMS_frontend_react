import { useSelector } from "react-redux";

const PermissionGate = ({
  permission,       // single permission (string)
  permissions = [], // multiple permissions (array)
  children,
  requireAll = false // if true → must have all permissions
}) => {
  const { user } = useSelector((state) => state.auth);

  const userPermissions = user?.permissions || [];

  // Convert single permission to array
  const requiredPermissions = permission
    ? [permission]
    : permissions;

  if (!requiredPermissions.length) return null;

  const hasAccess = requireAll
    ? requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
      )
    : requiredPermissions.some((perm) =>
        userPermissions.includes(perm)
      );

  return hasAccess ? children : null;
};

export default PermissionGate;
