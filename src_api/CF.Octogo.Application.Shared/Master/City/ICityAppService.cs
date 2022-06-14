using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.City.Dto
{
    public interface ICityAppService
    {
        Task<PagedResultDto<CityListDto>> GetCityList(PagedAndSortedInputDto input, string Filter);
        Task<int> CreateOrUpdateCity(CreateOrUpdateCityInput input);
        Task<DataSet> GetCityById(GetEditCityInput input);
        Task DeleteCity(EntityDto input);
    }
}
