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
using Abp.UI;

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
            "USP_GetAddonsList", parameters
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
            "USP_GetEditionListForAddon", parameters
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
        //public async Task<ListResultDto<AddonByEdtionIdDto>> GetAddonListByEditionId(int EditionId)
        //{
        //    SqlParameter[] parameters = new SqlParameter[1];
        //    parameters[0] = new SqlParameter("EditionId", EditionId);
        //    var ds = await SqlHelper.ExecuteDatasetAsync(
        //    Connection.GetSqlConnection("DefaultOctoGo"),
        //    System.Data.CommandType.StoredProcedure,
        //    "USP_GetAddonListByEditionId", parameters
        //       );
        //    if (ds.Tables.Count > 0)
        //    {
        //        var AddonDataRet = SqlHelper.ConvertDataTable<AddonByEdtionIdRet>(ds.Tables[0]);
        //        var AddonData = AddonDataRet.Select(rw => new AddonByEdtionIdDto
        //        {
        //            ModuleId = rw.ModuleId,
        //            ModuleName = rw.ModuleName,
        //            SubModuleList = rw.SubModuleList != null ? JsonConvert.DeserializeObject<List<ModuleDto>>(rw.SubModuleList.ToString()) : null
        //        }).ToList();
        //        return new ListResultDto<AddonByEdtionIdDto>(AddonData);
        //    }
        //    else
        //    {
        //        return null;
        //    }
        //}
    public async Task<AddonModuleAndPricingDto> GetAddonModuleAndPricing(int AddonId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("AddonId", AddonId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            // USP_GetAddonDetailsByModuleId
            "USP_GetAddonModuleAndPricing", parameters
               );
            if (ds.Tables.Count > 0)
            {
                var AddonDataRet = SqlHelper.ConvertDataTable<AddonModuleAndPricingRet>(ds.Tables[0]);
                var AddonData = AddonDataRet.Select(rw => new AddonModuleAndPricingDto
                {
                    ModuleList = rw.ModuleList != null ? JsonConvert.DeserializeObject<List<ModuleListForEditAddonDto>>(rw.ModuleList.ToString()) : null,
                    PricingData = rw.PricingData != null ? JsonConvert.DeserializeObject<List<ModulePricingDto>>(rw.PricingData.ToString()) : null
                }).FirstOrDefault();
                return AddonData;
            }
            else
            {
                return null;
            }
        }
        [AbpAuthorize(AppPermissions.Pages_Addons_Create, AppPermissions.Pages_Addons_Edit)]
        public async Task<int> InsertUpdateAddonModuleAndPricing(CreateAddonDto input)
        {
                var Duplicacy = CheckAddonDuplicacy(input.EditionID, input.AddonName, input.AddonId);

                if (Duplicacy.Result != null)
                {
                    throw new UserFriendlyException(L("DuplicateRecord"));
                }
                SqlParameter[] parameters = new SqlParameter[10];
                parameters[0] = new SqlParameter("ProductId", input.ProductId);
                parameters[1] = new SqlParameter("PricingData", input.priceDiscount != null ? JsonConvert.SerializeObject(input.priceDiscount) : null);
                parameters[2] = new SqlParameter("LoginUserId", AbpSession.UserId);
                parameters[3] = new SqlParameter("ApproachId", input.ApproachId);
                parameters[4] = new SqlParameter("AddonId", input.AddonId);
                parameters[5] = new SqlParameter("EditionID", input.EditionID);
                parameters[6] = new SqlParameter("AddonName", input.AddonName);
                parameters[7] = new SqlParameter("IsStandAlone", input.IsStandAlone);
                var x = JsonConvert.SerializeObject(input.ModuleList);
                parameters[8] = new SqlParameter("ModuleList", JsonConvert.SerializeObject(input.ModuleList));
                parameters[9] = new SqlParameter("Description", input.Description);
                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_InsertUpdateAddonAndPricing", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return (int)ds.Tables[0].Rows[0]["Id"];
                }
                else
                {
                    return 0;
                }
        }
        private async Task<DataSet> CheckAddonDuplicacy(int EditionId, string AddonName, int? AddonId)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            parameters[1] = new SqlParameter("AddonName", AddonName.Trim());
            parameters[2] = new SqlParameter("AddonId", AddonId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckAddonDuplicacy", parameters
            );
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="editionId"></param>
        /// <returns></returns>
        public async Task<List<ModuleListForAddonDto>> GetModuleListByEditionForAddon(int editionId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("EditionId", editionId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetModuleListByEditionForAddon", parameters
                    );
            if (ds.Tables.Count > 0)
            {
                var ModulesDataRet = SqlHelper.ConvertDataTable<ModuleListForAddonRet>(ds.Tables[0]);
                var ModulesData = ModulesDataRet.Select(rw => new ModuleListForAddonDto
                {
                    ModuleId = rw.ModuleId,
                    PageId = rw.PageId,
                    ModuleName = rw.ModuleName,
                    FromEditionId = rw.FromEditionId,
                    FromEditionName = rw.FromEditionName,
                    SubModuleList = rw.SubModuleList != null ? JsonConvert.DeserializeObject<List<SubModuleForAddonDto>>(rw.SubModuleList.ToString()) : null
                }).ToList();
                return ModulesData;
            }
            else
            {
                return null;
            }
        }
        [AbpAuthorize(AppPermissions.Pages_Addons_Delete)]
        public async Task DeleteAddon(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("AddonId", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);

            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteAddon", parameters);
        }
    }
}
