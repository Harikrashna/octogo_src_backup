using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.Dto;
using CF.Octogo.Editions.Dto;
using CF.Octogo.MultiTenancy.Dto;

namespace CF.Octogo.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
        Task<EditionsSelectOutput> GetEditionsForSelectForRegisteredUser();
        Task<EditionDetailsForEditDto> GetEditionDetailsById(int EditionId);
    }
}