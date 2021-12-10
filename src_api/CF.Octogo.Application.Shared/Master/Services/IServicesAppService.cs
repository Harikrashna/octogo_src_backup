using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CF.Octogo.Master.Services.Dto.CreateOrUpdateServiceInputDto;
using static CF.Octogo.Master.Services.Dto.EditServiceDto;
using static CF.Octogo.Master.Services.Dto.ServicesDto;

namespace CF.Octogo.Master.Services
{
    public interface IServicesAppService : IApplicationService
    {
        Task<PagedResultDto<ServicesListDto>> GetService(PagedAndSortedInputDto input, string filter);
        Task<int> CreateorUpdateService(CreateOrUpdateServiceInput inp);
        Task DeleteService(EntityDto input);
        Task<DataSet> GetServiceForEdit(GetEditServiceinput input);
        Task<DataSet> GetServiceByServiceId(int? inServiceID, string vcServiceName, string vcDescription);

    }
}
