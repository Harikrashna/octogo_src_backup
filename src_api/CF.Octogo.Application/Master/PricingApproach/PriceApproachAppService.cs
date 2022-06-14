using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Runtime.Caching;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using CF.Octogo.Master.PricingApproach;
using CF.Octogo.Master.PricingApproach.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CF.Octogo.Master.PricingApproach
{

    [AbpAuthorize(AppPermissions.Pages_Administration_PriceApproach)]
    public class PriceApproachAppService : OctogoAppServiceBase, IPriceApproachService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public PriceApproachAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        public async Task<PagedResultDto<PriceApproachListDto>> GetPricingApproach(GetPriceApproachInput input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[1] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.filter);

            DataSet ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPricingApproachList", parameters
            );
            var totalCount = 0;
            var pricingApproachList = new List<PriceApproachListDto>();
            if (ds.Tables.Count > 0)
            {
                var pricingApproachRet = SqlHelper.ConvertDataTable<PriceApproachListRet>(ds.Tables[0]);
                pricingApproachList = pricingApproachRet.Select(rw => new PriceApproachListDto
                {
                    Id = rw.Id,
                    ApproachName = rw.ApproachName,
                    Description = rw.Description
                }).ToList();
                if (pricingApproachRet != null && pricingApproachRet.Count > 0)
                {
                    totalCount = pricingApproachRet.FirstOrDefault().TotalCount;
                }
            }
            return new PagedResultDto<PriceApproachListDto>(
                totalCount,
                pricingApproachList
            );

        }

        public async Task InsertUpdatePricingApproach(CreateOrUpdatePriceApproachDto input)
        {
            if (input.ApproachId != 0)
            {
                await UpdatePriceApproachAsync(input);
            }
            else
            {
                await CreatePriceApproachAsync(input);
            }
        }

        protected virtual async Task<int> CreatePriceApproachAsync(CreateOrUpdatePriceApproachDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("ApproachId", input.ApproachId);
            parameters[1] = new SqlParameter("ApproachName", input.ApproachName.Trim());
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginUserId", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_CreateOrUpdateOrDeletePricingApproach", parameters);

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

        protected virtual async Task<int> UpdatePriceApproachAsync(CreateOrUpdatePriceApproachDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("ApproachId", input.ApproachId);
            parameters[1] = new SqlParameter("ApproachName", input.ApproachName.Trim());
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginUserId", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_CreateOrUpdateOrDeletePricingApproach", parameters);

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

        [AbpAuthorize(AppPermissions.Pages_Administration_PriceApproach_Delete)]
        public async Task<string> DeletePricingApproach(int ApproachId)
        {
            {
                SqlParameter[] parameters ={
                     new SqlParameter("ApproachId",(ApproachId)),
                     new SqlParameter("LoginUserId",  AbpSession.UserId),
                     new SqlParameter("IsDelete",  true)
                };
                await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_CreateOrUpdateOrDeletePricingApproach", parameters);
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
