using Abp.Auditing;
using CF.Octogo.Configuration.Dto;

namespace CF.Octogo.Configuration.Tenants.Dto
{
    public class TenantEmailSettingsEditDto : EmailSettingsEditDto
    {
        public bool UseHostDefaultEmailSettings { get; set; }
    }
}