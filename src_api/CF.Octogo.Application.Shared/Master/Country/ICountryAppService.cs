using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.Country.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.Country
{
    public interface ICountryAppService : IApplicationService
    {
        Task<PagedResultDto<CountryListDto>> GetCountry(PagedAndSortedInputDto input, string filter);
        Task<int> CreateorUpdateCountry(CreateOrUpdateCountryInput inp);
        Task DeleteCountry(EntityDto input);
        Task<DataSet> GetCountryForEdit(GetEditCountryInput input);
        Task<DataSet> GetCountryByCountryId(int? SNo, string CountryName, string CountryCode);
    }
}