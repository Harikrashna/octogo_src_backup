
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Runtime.Caching;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Master.Designation.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
namespace CF.Octogo.Master.Designation
{

    [AbpAuthorize(AppPermissions.Pages_Administration_Designation)]
    public class DesignationAppService : OctogoAppServiceBase, IDesignationService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public DesignationAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        public async Task<PagedResultDto<DesignationListDto>> GetDesignation(GetDesignationInput input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[1] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.filter);

            DataSet ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetDesignationList", parameters
            );

            var totalCount = 0;
            var designationList = new List<DesignationListDto>();
            if (ds.Tables.Count > 0)
            {
                var ret = SqlHelper.ConvertDataTable<DesignationListRet>(ds.Tables[0]);
                designationList = ret.Select(rw => new DesignationListDto
                {
                    Id = rw.Id,
                    DesignationName = rw.DesignationName,
                    Description = rw.Description
                }).ToList();
                if (ret != null && ret.Count > 0)
                {
                    totalCount = ret.FirstOrDefault().TotalCount;
                }
            }
            return new PagedResultDto<DesignationListDto>(
                totalCount,
                designationList
                );

        }

        public async Task InsertUpdateDesignation(CreateOrUpdateDesignationDto input)
        {
            if (input.DesignationId != 0)
            {
                await UpdateDesignationAsync(input);

            }
            else
            {
                await CreateDesignationAsync(input);
            }
        }


        [AbpAuthorize(AppPermissions.Pages_Administration_Designation_Create)]
        protected virtual async Task<int> CreateDesignationAsync(CreateOrUpdateDesignationDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("DesignationId", input.DesignationId);
            parameters[1] = new SqlParameter("DesignationName", input.DesignationName.Trim());
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginUserId", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_InsertOrUpdateOrDeleteDesignation", parameters);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (int)ds.Tables[0].Rows[0]["Id"] == 0)
            {
                throw new UserFriendlyException(L((string)ds.Tables[0].Rows[0]["Message"]));
            }
            else if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (string)ds.Tables[0].Rows[0]["Message"] == "Success" && (int)ds.Tables[0].Rows[0]["Id"] > 0)
            {
                await ClearCache();
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Designation_Edit)]
        protected virtual async Task<int> UpdateDesignationAsync(CreateOrUpdateDesignationDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("DesignationId", input.DesignationId);
            parameters[1] = new SqlParameter("DesignationName", input.DesignationName.Trim());
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginUserId", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure, "USP_InsertOrUpdateOrDeleteDesignation", parameters);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (int)ds.Tables[0].Rows[0]["Id"] == 0)
            {
                throw new UserFriendlyException(L((string)ds.Tables[0].Rows[0]["Message"]));
            }
            else if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (string)ds.Tables[0].Rows[0]["Message"] == "Success" && (int)ds.Tables[0].Rows[0]["Id"] > 0)
            {
                await ClearCache();
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }


        [AbpAuthorize(AppPermissions.Pages_Administration_Designation_Delete)]
        public async Task<string> DeleteDesignation(int designationId)
        {
            {
                SqlParameter[] parameters ={
                     new SqlParameter("DesignationId", designationId),
                     new SqlParameter("LoginUserId", AbpSession.UserId),
                     new SqlParameter("IsDelete", true)
                };
                await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_InsertOrUpdateOrDeleteDesignation", parameters);
                await ClearCache();
                return "Success";
            }
        }
        public async Task ClearCache()
        {
            var allMasterCache = _cacheManager.GetCache(masterCacheKey);
            await allMasterCache.ClearAsync();
        }
    }
}