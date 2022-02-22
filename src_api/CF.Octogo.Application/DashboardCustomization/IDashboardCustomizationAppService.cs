using System.Collections.Generic;
using Abp.Application.Services;
using System.Threading.Tasks;
using CF.Octogo.DashboardCustomization.Dto;
using Abp.Application.Services.Dto;

namespace CF.Octogo.DashboardCustomization
{
    public interface IDashboardCustomizationAppService : IApplicationService
    {
        Task<Dashboard> GetUserDashboard(GetDashboardInput input);

        Task SavePage(SavePageInput input);

        Task RenamePage(RenamePageInput input);

        Task<AddNewPageOutput> AddNewPage(AddNewPageInput input);

        Task<Widget> AddWidget(AddWidgetInput input);

        Task DeletePage(DeletePageInput input);

        DashboardOutput GetDashboardDefinition(GetDashboardInput input);

        List<WidgetOutput> GetAllWidgetDefinitions(GetDashboardInput input);
        Task<ListResultDto<EditionAndProductListDto>> GetProductAndEditionDetailByUserId(int userId);
        Task<List<TenantEditionAddonDto>> GetTenantEditionAddonDetailsByTenantId(int TenantId);
        Task<List<TenantEditionAddonModulesDto>> GetTenantEditionAddonModuleDetails(int EditionId);
    }
}
