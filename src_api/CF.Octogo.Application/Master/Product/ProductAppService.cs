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
using Abp.Runtime.Caching;
using Newtonsoft.Json;
using CF.Octogo.Master.Product.Dto;

namespace CF.Octogo.Master.Product
{
    [AbpAuthorize(AppPermissions.Pages_Administration_Product)]
    public class ProductAppService : OctogoAppServiceBase, IProductAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public ProductAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        public async Task<PagedResultDto<ProductListDto>> GetProduct(PagedAndSortedInputDto input, string filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[2] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[3] = new SqlParameter("Filter", filter);
            List<ProductListDto> ProductList = new List<ProductListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetProductsListOrProductForEdit", parameters
            );

            if (ds.Tables.Count > 0)
            {
              
                var totalCount = 0;

                var ProductListDto = SqlHelper.ConvertDataTable<ProductListRet>(ds.Tables[0]);
                var productList = new List<ProductListDto>();
                productList = ProductListDto.Select(rw => new ProductListDto
                {
                    InProductID = rw.ProductId,
                    VcDescription = rw.Description,
                    VcProductName = rw.ProductName
                }).ToList();

                if (ProductListDto != null && ProductListDto.Count > 0)
                {
                    totalCount = ProductListDto.FirstOrDefault().TotalCount;

                }

                return new PagedResultDto<ProductListDto>(totalCount, productList);
            }
            else
            {
                return null;
            }
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Product_CreateProduct, AppPermissions.Pages_Administration_Product_Edit)]
        public async Task<int> CreateorUpdateProduct(CreateOrUpdateProductInput inp)
        {

            SqlParameter[] parameters = new SqlParameter[6];
            parameters[0] = new SqlParameter("inProductID", inp.inProductID);
            parameters[1] = new SqlParameter("vcProductName", inp.vcProductName.Trim());
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
            parameters[4] = new SqlParameter("SelectedPageIds", inp.SelectedPageIds);
            parameters[5] = new SqlParameter("userTypes", inp.userTypes);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteProduct", parameters); // Change procedure name "USP_CreateOrUpdateProduct" to "USP_CreateOrUpdateOrDeleteProduct"
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (string)ds.Tables[0].Rows[0]["Message"] == "DuplicateRecord" && (int)ds.Tables[0].Rows[0]["Id"] == 0)
            {

                throw new UserFriendlyException(L("DuplicateRecord"));
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
        [AbpAuthorize(AppPermissions.Pages_Administration_Product_Delete)]
        public async Task DeleteProduct(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("inProductID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);
            parameters[2] = new SqlParameter("IsDelete", true);

            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
               System.Data.CommandType.StoredProcedure,
               "USP_CreateOrUpdateOrDeleteProduct", parameters); // Change procedure name "USP_DeleteProduct" to "USP_CreateOrUpdateOrDeleteProduct"
            await ClearCache();

        }



        public async Task<ProductandUserEdit> GetProductById(GetEditProductinput input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("ProductID", input.inProductID);
            parameters[1] = new SqlParameter("IsEdit", true); 
             var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetProductsListOrProductForEdit", parameters
            );
            if (ds.Tables.Count > 0)
            {
                var res = SqlHelper.ConvertDataTable<ProductandUserRet>(ds.Tables[0]);
                var result = res.Select(rw => new ProductandUserEdit
                {
                    inProductID = rw.inProductID,
                    vcProductName = rw.vcProductName,
                    vcDescription = rw.vcDescription,
                    UserTypes = rw.UserTypes != null ? JsonConvert.DeserializeObject<List<ProductUserTypeEditDto>>(rw.UserTypes.ToString()) : null

                }).FirstOrDefault();
                return result;
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
        public async Task<List<ProductModulesDto>> GetProductModuleList(int InProductID)
        {
                SqlParameter[] parameters = new SqlParameter[1];
                parameters[0] = new SqlParameter("ProductId", InProductID);
                var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetProductPageModuleList", parameters);
                if (ds.Tables.Count > 0)
                {
                    var res = SqlHelper.ConvertDataTable<ProductModuleRet>(ds.Tables[0]);
                    var result = res.Select(rw => new ProductModulesDto
                    {
                        ModuleId = rw.ModuleId,
                        DisplayName = rw.DisplayName,
                        SubModuleList = rw.SubModuleList != null ? JsonConvert.DeserializeObject<List<ProductSubModuleDto>>(rw.SubModuleList.ToString()) : null,
                    }).ToList();
                    return result;

                }
                else
                {
                    return null;
                }
        }
        /// <summary>
        /// Desc:Get product list by UserTypeId
        /// Author:Merajuddin
        /// Date:11-04-2022
        /// </summary>
        /// <param name="UserTypeId"></param>
        /// <param name="QueryFor"></param>
        /// <returns></returns>
        public async Task<List<ProductListByUserType>> GetProduclistByUsertypeId(int? UserTypeId, string QueryFor)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("QueryFor", QueryFor);
            parameters[1] = new SqlParameter("UserTypeId", UserTypeId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_GetAddonsList", parameters);
            if (ds.Tables.Count > 0)
            {
                var res = SqlHelper.ConvertDataTable<ProductListByUserType>(ds.Tables[0]);
                var result = res.Select(rw => new ProductListByUserType
                {
                    Id = rw.Id,
                    Name = rw.Name,
                }).ToList();
                return result;

            }
            else
            {
                return null;
            }
        }
    }
}
