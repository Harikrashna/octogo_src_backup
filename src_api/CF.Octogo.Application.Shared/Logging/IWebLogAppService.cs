using Abp.Application.Services;
using CF.Octogo.Dto;
using CF.Octogo.Logging.Dto;

namespace CF.Octogo.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
