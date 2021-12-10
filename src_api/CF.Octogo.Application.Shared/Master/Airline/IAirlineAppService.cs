using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.Airline.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CF.Octogo.Master.Airline
{
    public interface IAirlineAppService : IApplicationService
    {
        Task<PagedResultDto<AirlineListDto>> GetAirline(PagedAndSortedInputDto input, string filter);
        Task<int> CreateorUpdateAirline(CreateOrUpdateAirlineInput inp);
        Task DeleteAirline(EntityDto input);
        Task<DataSet> GetAirlineForEdit(GetEditAirlineinput input);
        Task<DataSet> GetAirlineByAirlineId(int? inAirlineID, string vcAirlineName);

    }
}