using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.Install.Dto;

namespace CF.Octogo.Install
{
    public interface IInstallAppService : IApplicationService
    {
        Task Setup(InstallDto input);

        AppSettingsJsonDto GetAppSettingsJson();

        CheckDatabaseOutput CheckDatabase();
    }
}