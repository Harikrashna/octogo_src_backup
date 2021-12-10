using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Data.SqlClient;
using System.Threading.Tasks;
using CF.Octogo.Data;
using CF.Octogo.Master.Airline.Dto;

namespace CF.Octogo.Master.Airline
{
    public class AirlineAppService : OctogoAppServiceBase, IAirlineAppService
    {
        //[AbpAuthorize(AppPermissions.Pages_Administration_Airline)]
        public async Task<PagedResultDto<AirlineListDto>> GetAirline(PagedAndSortedInputDto input, string filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[3] = new SqlParameter("Filter", filter);
            List<AirlineListDto> AirlineList = new List<AirlineListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetAirline", parameters
            );

            if (ds.Tables.Count > 0)
            {
                int v = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                var totalCount = v;
                DataTable dt = ds.Tables[0];

                AirlineList = (from DataRow dr in dt.Rows
                               select new AirlineListDto()
                               {
                                   inAirlineID = Convert.ToInt32(dr["AirlineId"]),
                                   vcAirlineName = dr["AirlineName"].ToString(),
                                   vcDescription = dr["Description"].ToString(),

                               }).ToList();
                return new PagedResultDto<AirlineListDto>(totalCount, AirlineList);
            }
            else
            {
                return null;
            }
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Airline_Create, AppPermissions.Pages_Administration_Airline_Edit)]
        public async Task<int> CreateorUpdateAirline(CreateOrUpdateAirlineInput inp)
        {

            var dup_data = GetAirlineByAirlineId(inp.inAirlineID, inp.vcAirlineName);

            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inAirlineID", inp.inAirlineID);
            parameters[1] = new SqlParameter("vcAirlineName", inp.vcAirlineName);
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateAirline", parameters);





            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Airline_Delete)]

        public async Task DeleteAirline(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("AirlineID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);




            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteAirline", parameters);

        }


        [AbpAuthorize(AppPermissions.Pages_Administration_Airline_Edit)]
        public async Task<DataSet> GetAirlineForEdit(GetEditAirlineinput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("AirlineID", input.inAirlineID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetAirlineById", parameters
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


        public async Task<DataSet> GetAirlineByAirlineId(int? inAirlineID, string vcAirlineName)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("AirlineId", inAirlineID);
            parameters[1] = new SqlParameter("AirlineName", vcAirlineName);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicateRecord", parameters
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


    }

}


