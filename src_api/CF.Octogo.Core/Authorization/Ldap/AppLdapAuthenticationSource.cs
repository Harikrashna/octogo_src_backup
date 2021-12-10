using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using CF.Octogo.Authorization.Users;
using CF.Octogo.MultiTenancy;

namespace CF.Octogo.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}