using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using CF.Octogo.Data;
using System.Data;
using System.Data.SqlClient;
using CF.Octogo.Product.Dto;
using Abp.Authorization;
using CF.Octogo.Authorization;
using CF.Octogo.Dto;
using Abp.UI;

namespace CF.Octogo.Master.Product
{
    [AbpAuthorize(AppPermissions.Pages_Administration_Product)]
    public class ProductAppService : OctogoAppServiceBase, IProductAppService
    {

        public async Task<PagedResultDto<ProductListDto>> GetProduct(PagedAndSortedInputDto input, string filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[3] = new SqlParameter("Filter", filter);
            List<ProductListDto> ProductList = new List<ProductListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetProducts", parameters
            );

            if (ds.Tables.Count > 0)
            {
                int v = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                var totalCount = v;
                DataTable dt = ds.Tables[0];

                ProductList = (from DataRow dr in dt.Rows
                               select new ProductListDto()
                               {
                                   inProductID = Convert.ToInt32(dr["ProductId"]),
                                   vcProductName = dr["ProductName"].ToString(),
                                   vcDescription = dr["Description"].ToString(),

                               }).ToList();
                return new PagedResultDto<ProductListDto>(totalCount, ProductList);
            }
            else
            {
                return null;
            }
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Product_CreateProduct, AppPermissions.Pages_Administration_Product_Edit)]
        public async Task<int> CreateorUpdateProduct(CreateOrUpdateProductInput inp)
        {

            var dup_data = GetProductByProductId(inp.inProductID, inp.vcProductName);

            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inProductID", inp.inProductID);
            parameters[1] = new SqlParameter("vcProductName", inp.vcProductName);
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateProduct", parameters);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Product_Delete)]
        public async Task DeleteProduct(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("ProductID", input.Id);
            parameters[0] = new SqlParameter("@UserId", AbpSession.UserId);


            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteProduct", parameters);

        }



        public async Task<DataSet> GetProductForEdit(GetEditProductinput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("ProductID", input.inProductID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPoductId", parameters
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


        public async Task<DataSet> GetProductByProductId(int? inProductID, string vcProductName)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("ProductId", inProductID);
            parameters[1] = new SqlParameter("ProductName", vcProductName);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicacy", parameters
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
