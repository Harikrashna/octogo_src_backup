using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using CF.Octogo.Data;
using System.Data;
using System.Data.SqlClient;
using CF.Octogo.Dto;
using Abp.UI;
using static CF.Octogo.Master.Services.Dto.ServicesDto;
using Abp.Authorization;
using CF.Octogo.Authorization;
using static CF.Octogo.Master.Services.Dto.EditServiceDto;
using static CF.Octogo.Master.Services.Dto.CreateOrUpdateServiceInputDto;
using Abp.Runtime.Caching;

namespace CF.Octogo.Master.Services
{

    public class ServicesAppService : OctogoAppServiceBase, IServicesAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public ServicesAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Services)]
        public async Task<PagedResultDto<ServicesListDto>> GetService(PagedAndSortedInputDto input, string filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[3] = new SqlParameter("Filter", filter);
            List<ServicesListDto> ServiceList = new List<ServicesListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetServices", parameters
            );

            if (ds.Tables.Count > 0)
            {
                int v = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                var totalCount = v;
                DataTable dt = ds.Tables[0];

                ServiceList = (from DataRow dr in dt.Rows
                               select new ServicesListDto()
                               {
                                   inServiceID = Convert.ToInt32(dr["ServiceId"]),
                                   vcServiceName = dr["ServiceName"].ToString(),
                                   vcDescription = dr["Description"].ToString(),

                               }).ToList();
                return new PagedResultDto<ServicesListDto>(totalCount, ServiceList);
            }
            else
            {
                return null;
            }
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Services_CreateServices, AppPermissions.Pages_Administration_Services_Edit)]
        public async Task<int> CreateorUpdateService(CreateOrUpdateServiceInput inp)
        {

            var dup_data = GetServiceByServiceId(inp.inServiceID, inp.vcServiceName);

            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inServiceID", inp.inServiceID);
            parameters[1] = new SqlParameter("vcServiceName", inp.vcServiceName.Trim());
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateService", parameters);





            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                await ClearCache();
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Services_Delete)]

        public async Task DeleteService(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("ServiceID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);
            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteService", parameters);
            await ClearCache();
        }



        public async Task<DataSet> GetServiceForEdit(GetEditServiceinput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("ServiceID", input.inServiceID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetServiceById", parameters
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


        public async Task<DataSet> GetServiceByServiceId(int? inServiceID, string vcServiceName)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("ServiceId", inServiceID);
            parameters[1] = new SqlParameter("ServiceName", vcServiceName);


            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicateServices", parameters
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
        public async Task ClearCache()
        {
            var allMasterCache = _cacheManager.GetCache(masterCacheKey);
            await allMasterCache.ClearAsync();
        }

    }

}

