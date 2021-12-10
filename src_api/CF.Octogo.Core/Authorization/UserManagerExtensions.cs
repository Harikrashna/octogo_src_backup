using System.Threading.Tasks;
using Abp.Authorization.Users;
using CF.Octogo.Authorization.Users;

namespace CF.Octogo.Authorization
{
    public static class UserManagerExtensions
    {
        public static async Task<User> GetAdminAsync(this UserManager userManager)
        {
            return await userManager.FindByNameAsync(AbpUserBase.AdminUserName);
        }
    }
}
