using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.Configuration.Tenants.Dto;

namespace CF.Octogo.Configuration.Tenants
{
    public interface ITenantSettingsAppService : IApplicationService
    {
        Task<TenantSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(TenantSettingsEditDto input);

        Task ClearLogo();

        Task ClearCustomCss();
    }
}
