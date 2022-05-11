using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Addons.Dto;
using CF.Octogo.Authorization.Users.Dto;
using CF.Octogo.Editions.Dto;

namespace CF.Octogo.Editions
{
    public interface IAddonAppService : IApplicationService
    {
        Task<PagedResultDto<AddonListDto>> GetAddonList(GetAddonInput input);
        Task<ListResultDto<EditionListByProductForAddonDto>> GetEditionListForAddon(int ProductId);
        // Task<ListResultDto<AddonByEdtionIdDto>> GetAddonListByEditionId(int EditionId);
        Task<List<ModuleListForAddonDto>> GetModuleListByEditionForAddon(int editionId);
        Task<AddonModuleAndPricingDto> GetAddonModuleAndPricing(int AddonId);
        Task<string> DeleteAddon(EntityDto input);
        Task<int> InsertUpdateAddonModuleAndPricing(CreateAddonDto input);
        Task<FeatureTreeEditModel> GetStandaloneAddonFeaturesById(int? addOnId);
        Task<List<AddonCompareResultDto>> GetAddonDetailsByAddonIdsForCompare(string AddonIds);
    }
}
