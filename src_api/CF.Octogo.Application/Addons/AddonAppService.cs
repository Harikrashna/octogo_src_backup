using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using CF.Octogo.Data;
using Microsoft.AspNetCore.Mvc;
using CF.Octogo.Editions.Dto;
using Abp.Authorization;
using CF.Octogo.Authorization;
using System.Data.SqlClient;
using System.Data;
using System;
using System.Linq;
using Newtonsoft.Json;

namespace CF.Octogo.Editions
{
    [AbpAuthorize(AppPermissions.Pages_Addons)]
    public class AddonAppService : OctogoAppServiceBase, IAddonAppService
    {
        public AddonAppService() { }

        [HttpPost]
        public async Task<PagedResultDto<AddonListDto>> GetAddonList(GetAddonInput input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[1] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.Filter);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "Usp_GetAddonsList", parameters
        );
            var totalCount = 0;
            var addonList = new List<AddonListDto>();
            if (ds.Tables.Count > 0)
            {
                addonList = SqlHelper.ConvertDataTable<AddonListDto>(ds.Tables[0]);
                DataRow row = ds.Tables[1].Rows[0];
                totalCount = Convert.ToInt32(row["totalCount"]);
            }
            return new PagedResultDto<AddonListDto>(
                totalCount,
                addonList
            );
        }
        public async Task<ListResultDto<EditionListByProductDto>> GetEditionListForAddon(int ProductId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("ProductId", ProductId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "Usp_GetEditionListForAddon", parameters
               );
            if (ds.Tables.Count > 0)
            {
                return new ListResultDto<EditionListByProductDto>(SqlHelper.ConvertDataTable<EditionListByProductDto>(ds.Tables[0]));
            }
            else
            {
                return null;
            }
        }
        public async Task<ListResultDto<AddonByEdtionIdDto>> GetAddonListByEditionId(int EditionId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "Usp_GetAddonListByEditionId", parameters
               );
            if (ds.Tables.Count > 0)
            {
                var AddonDataRet = SqlHelper.ConvertDataTable<AddonByEdtionIdRet>(ds.Tables[0]);
                var AddonData = AddonDataRet.Select(rw => new AddonByEdtionIdDto
                {
                    ModuleId = rw.ModuleId,
                    ModuleName = rw.ModuleName,
                    SubModuleList = rw.SubModuleList != null ? JsonConvert.DeserializeObject<List<ModuleDto>>(rw.SubModuleList.ToString()) : null
                }).ToList();
                return new ListResultDto<AddonByEdtionIdDto>(AddonData);
            }
            else
            {
                return null;
            }
        }
    public async Task<ListResultDto<AddonByEdtionIdDto>> GetAddonDetailsByModuleId(int ModuleId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("ModuleId", ModuleId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "Usp_GetAddonDetailsByModuleId", parameters
               );
            if (ds.Tables.Count > 0)
            {
                var AddonDataRet = SqlHelper.ConvertDataTable<AddonByEdtionIdRet>(ds.Tables[0]);
                var AddonData = AddonDataRet.Select(rw => new AddonByEdtionIdDto
                {
                    ModuleId = rw.ModuleId,
                    ModuleName = rw.ModuleName,
                    SubModuleList = rw.SubModuleList != null ? JsonConvert.DeserializeObject<List<ModuleDto>>(rw.SubModuleList.ToString()) : null,
                    PricingData = rw.PricingData != null ? JsonConvert.DeserializeObject<List<ModulePricingDto>>(rw.PricingData.ToString()) : null
                }).ToList();
                return new ListResultDto<AddonByEdtionIdDto>(AddonData);
            }
            else
            {
                return null;
            }
        }
        [AbpAuthorize(AppPermissions.Pages_Addons_Create, AppPermissions.Pages_Addons_Edit)]
        public async Task<int> InsertUpdateAddonModuleAndPricing(CreateAddonDto input)
        {
                SqlParameter[] parameters = new SqlParameter[7];
                parameters[0] = new SqlParameter("ProductId", input.ProductId);
                parameters[1] = new SqlParameter("PricingData", input.priceDiscount != null ? JsonConvert.SerializeObject(input.priceDiscount) : null);
                parameters[2] = new SqlParameter("LoginUserId", AbpSession.UserId);
                parameters[3] = new SqlParameter("ApproachId", input.ApproachId);
                parameters[4] = new SqlParameter("AddonId", input.AddonId);
                parameters[5] = new SqlParameter("EditionID", input.EditionID);
                parameters[6] = new SqlParameter("ModuleId", input.ModuleId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "InsertUpdateAddonAndPricing", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return (int)ds.Tables[0].Rows[0]["Id"];
                }
                else
                {
                    return 0;
                }
        }
    }
}
