using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Text;
using Abp.Application.Services.Dto;
using System.Threading.Tasks;
using CF.Octogo.Master.Designation.Dto;

namespace CF.Octogo.Master.Designation
{
    public interface IDesignationService : IApplicationService
    {
        Task<PagedResultDto<DesignationListDto>> GetDesignation(GetDesignationInput input);
        Task InsertUpdateDesignation(CreateOrUpdateDesignationDto input);
        Task<string> DeleteDesignation(int input);

    }
}
