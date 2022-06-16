using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Runtime.Caching;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using CF.Octogo.Master.UserType.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CF.Octogo.Master.UserType
{
    public class UserTypeAppService : OctogoAppServiceBase, IUserTypeAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public UserTypeAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_UserType)]
        public async Task<PagedResultDto<UserTypeListDto>> GetUserTypeList(PagedAndSortedInputDto input, string filter)
        {

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[2] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[3] = new SqlParameter("Filter", filter);
            List<UserTypeListDto> UserTypeList = new List<UserTypeListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetUserTypeList", parameters); 
            if (ds.Tables.Count > 0)   
            {
                var totalCount = 0;
                var userTypeList = SqlHelper.ConvertDataTable<UserTypeListDto>(ds.Tables[0]);
                if (userTypeList != null && userTypeList.Count > 0)
                {
                    totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TotalCount"]);
                }
                return new PagedResultDto<UserTypeListDto>(totalCount, userTypeList);
            }
            return null;
        }



        //[AbpAuthorize(AppPermissions.Pages_Administration_UserType_CreateUserType, AppPermissions.Pages_Administration_UserType_Edit)]
        //public async Task<int> CreateorUpdateUserType(CreateOrUpdateUserTypeInputDto inp)
        //{

        //    var dup_data = GetUserTypeByUserTypeId(inp.inUserTypeID, inp.vcUserTypeName);

        //    if (dup_data.Result != null)
        //    {
        //        throw new UserFriendlyException(L("DuplicateRecord"));
        //    }

        //    SqlParameter[] parameters = new SqlParameter[4];
        //    parameters[0] = new SqlParameter("inUserTypeID", inp.inUserTypeID);
        //    parameters[1] = new SqlParameter("vcUserTypeName", inp.vcUserTypeName.Trim());
        //    parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
        //    parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
        //    var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
        //   System.Data.CommandType.StoredProcedure,
        //   "USP_CreateOrUpdateUserType", parameters);





        //    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //    {
        //        await ClearCache();
        //        return (int)ds.Tables[0].Rows[0]["Id"];
        //    }
        //    else
        //    {
        //        return 0;
        //    }




        //}
        [AbpAuthorize(AppPermissions.Pages_Administration_UserType_CreateUserType, AppPermissions.Pages_Administration_UserType_Edit)]
        public async Task<int> CreateorUpdateUserType(CreateOrUpdateUserTypeInputDto inp)
        {

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inUserTypeID", inp.inUserTypeID);
            parameters[1] = new SqlParameter("vcUserTypeName", inp.vcUserTypeName.Trim());
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteUserType", parameters); // Change procedure name "USP_CreateOrUpdateUserType" to "USP_CreateOrUpdateOrDeleteUserType"


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
        [AbpAuthorize(AppPermissions.Pages_Administration_UserType_Delete)]

        public async Task DeleteUserType(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("inUserTypeID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);
            parameters[2] = new SqlParameter("IsDelete", true);

            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteUserType", parameters); // Change procedure name "USP_DeleteUserType" to "USP_CreateOrUpdateOrDeleteUserType"
            await ClearCache();
        }



        public async Task<DataSet> GetUserTypeById(GetEditUserTypeinput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserTypeID", input.inUserTypeID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetUserTypeList", parameters); 
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