using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using CF.Octogo.Master.Department.Dto;
using System.Threading.Tasks;
using Abp.Runtime.Caching;

namespace CF.Octogo.Master.Department
{
    public class DepartmentAppService : OctogoAppServiceBase, IDepartmentAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public DepartmentAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Department)]
        public async Task<PagedResultDto<DepartmentListDto>> GetDepartment(DepartmentListInputDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[1] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.filter);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetDepartmentList", parameters
            );

            var totalCount = 0;
            var departmentList = new List<DepartmentListDto>();
            if (ds.Tables.Count > 0)
            {
                departmentList = SqlHelper.ConvertDataTable<DepartmentListDto>(ds.Tables[0]);
                if (departmentList != null && departmentList.Count > 0)
                {
                    totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TotalCount"]);
                }
            }
            return new PagedResultDto<DepartmentListDto>(
                totalCount,
                departmentList
            );
        }
        public async Task<int> CreateOrUpdateDepartment(CreateOrUpdateDepartmentInput inp)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inDepartmentID", inp.inDepartmentID);
            parameters[1] = new SqlParameter("vcDepartmentName", inp.vcDepartmentName.Trim());
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("LoginUserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteDepartment", parameters);


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
        [AbpAuthorize(AppPermissions.Pages_Administration_Department_Delete)]
        public async Task DeleteDepartment(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("inDepartmentID", input.Id);
            parameters[1] = new SqlParameter("LoginUserId", AbpSession.UserId);
            parameters[2] = new SqlParameter("IsDelete", true);
            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteDepartment", parameters);
            await ClearCache();
        }
        public async Task<DataSet> GetDepartmentById(EditDepartmentDto input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("DepartmentID", input.inDepartmentID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetDepartmentList", parameters
            );
            if (ds.Tables.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }
        public async Task ClearCache()
        {
            var allMasterCache = _cacheManager.GetCache(masterCacheKey);
            await allMasterCache.ClearAsync();
        }

    }

}