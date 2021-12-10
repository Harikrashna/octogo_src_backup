using Abp.Authorization;
using CF.Octogo.Authorization.Roles;
using CF.Octogo.Authorization.Users;

namespace CF.Octogo.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
