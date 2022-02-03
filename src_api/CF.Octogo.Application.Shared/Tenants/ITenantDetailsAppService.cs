using Abp.Application.Services;
using CF.Octogo.Tenants.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Tenants
{
    public interface ITenantDetailsAppService : IApplicationService
    {
        Task<PageDetailsWithProduct> GetPageSnoByTenantAndProductId(TenantProductInputDto input);
        Task<List<TenantPageSnoListDto>> EditionModuleAndPagesByUserId(UserProductInputDto input);
        Task<string> CreateAdminUserOnTenantDB(int? tenantId = null);
        Task UpdateTenantSyetemSettingForEditionUpdate(int editionId, int? tenantId, int? addonId = null);
    }
}
