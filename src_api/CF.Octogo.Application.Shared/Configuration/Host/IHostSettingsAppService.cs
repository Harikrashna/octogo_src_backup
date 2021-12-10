using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.Configuration.Host.Dto;

namespace CF.Octogo.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);
    }
}
