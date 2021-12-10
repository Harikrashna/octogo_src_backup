using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.Industry.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.Industry
{
    public interface IIndustryAppService : IApplicationService
    {
        Task<PagedResultDto<IndustryListDto>> GetIndustry(PagedAndSortedInputDto input, string filter);
        Task<int> CreateorUpdateIndustry(CreateOrUpdateIndustryInput inp);
        Task DeleteIndustry(EntityDto input);
        Task<DataSet> GetIndustryForEdit(GetEditIndustryinput input);
        Task<DataSet> GetIndustryByIndustryId(int? inIndustryID, string vcIndustryName, string vcDescription);

    }
}
