using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Editions.Dto;

namespace CF.Octogo.Editions
{
    public interface IEditionAppService : IApplicationService
    {
        Task<ListResultDto<EditionListDto>> GetEditions();

        Task<GetEditionEditOutput> GetEditionForEdit(NullableIdDto input);

        Task CreateEdition(CreateEditionDto input);

        Task UpdateEdition(UpdateEditionDto input);

        Task DeleteEdition(EntityDto input);

        Task MoveTenantsToAnotherEdition(MoveTenantsToAnotherEditionDto input);

        Task<List<SubscribableEditionComboboxItemDto>> GetEditionComboboxItems(int? selectedEditionId = null, bool addAllItem = false, bool onlyFree = false);

        Task<int> GetTenantCount(int editionId);
        Task<PagedResultDto<EditionListDtoNew>> GetEditionsList(GetEditionInput input);
        Task<EditionDetailsForEditDto> GetEditionDetailsForEdit(int EditionId);
        Task<List<EditionCompareResultDto>> GetEditionDeatilsByEditionIdForCompare(string EditionIds);
        Task<List<ProductWithEditionDto>> GetProductWithEdition(ProductWithEditionInputDto input);
        Task<DataSet> GetMasterDataForEdition();
        Task<EditionModulesDto> GetEditionModules(int EditionId);
    }
}