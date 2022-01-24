using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using CF.Octogo.Authorization.Roles;
using CF.Octogo.Authorization.Users;
using CF.Octogo.Data;
using CF.Octogo.Tenants.Dto;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Tenants
{
    public class TenantDetailsAppService : OctogoAppServiceBase, ITenantDetailsAppService
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly RoleManager _roleManager;
        private readonly UserManager _userManager;
        private readonly IRepository<UserRole, long> _userRolesRepository;
        public TenantDetailsAppService(
            IRepository<UserRole, long> userRolesRepository,
            IUnitOfWorkManager UnitOfWorkManager,
             RoleManager roleManager,
            UserManager userManager)
        {
            _userRolesRepository = userRolesRepository;
            _unitOfWorkManager = UnitOfWorkManager;
            _roleManager = roleManager;
            _userManager = userManager;
        }
        public async Task<List<TenantPageSnoListDto>> GetPageSnoByTenantAndProductId(TenantProductInputDto input)
        {
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("TenantId", input.TenantId);
                parameters[1] = new SqlParameter("ProductId", input.ProductId);
                var ds = await SqlHelper.ExecuteDatasetAsync(
                        Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_GetPageSnoByTenantAndProductId", parameters
                        );
                if (ds.Tables.Count > 0)
                {
                    return SqlHelper.ConvertDataTable<TenantPageSnoListDto>(ds.Tables[0]);
                }
                else
                {
                    return null;
                }
        }
        public async Task<List<TenantPageSnoListDto>> EditionModuleAndPagesByUserId(UserProductInputDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("UserId", input.UserId);
            parameters[1] = new SqlParameter("ProductId", input.ProductId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_EditionModuleAndPagesByUserId", parameters
               );
            if (ds.Tables.Count > 0)
            {
                return SqlHelper.ConvertDataTable<TenantPageSnoListDto>(ds.Tables[0]);

            }
            else
            {
                return null;
            }
        }
        /// <summary>
        /// 
        /// Desc:Get Tenant database details
        /// Created by: Merajuddin khan
        /// Created on:21-01-22
        /// </summary>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        public async Task<TenantDBDetailsDto> GetTenantDataBaseDetails(int? tenantId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("TenantId", tenantId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetTenantDataBaseDetails", parameters
                    );
            if (ds.Tables.Count > 0)
            {
                var result = SqlHelper.ConvertDataTable<TenantDBDetailsDto>(ds.Tables[0]);
                if (result.Count > 0)
                {
                    var tenantDetails = new ListResultDto<TenantDBDetailsDto>(result);

                    foreach (var tenantDetailss in result)
                    {
                        using (_unitOfWorkManager.Current.SetTenantId(tenantDetailss.TenantId))
                        {
                            //var userData = _userRolesRepository.GetAll().Where(obj => obj.);
                            var roleId = _roleManager.Roles.Where(obj => obj.DisplayName.ToLower() == "admin").FirstOrDefault().Id;
                            var userId = _userRolesRepository.GetAll().Where(obj => obj.RoleId == roleId).FirstOrDefault().UserId;
                            var userData = _userManager.GetUserById(userId);
                            var tenantadminDetails = result.Select(rw => new TenantDBDetailsDto
                            {
                                UserName = userData.UserName,
                                Password = userData.Password,
                                ConnectionString = tenantDetailss.ConnectionString,
                                FirstName = userData.Name,
                                LastName = userData.Surname
                            }).FirstOrDefault();

                            await InsertAdminDetailsOnTenantDataBase(tenantadminDetails);

                        }
                    }
                }
            }

            return null;
        }
        /// <summary>
        /// 
        /// Desc:Insert Tenant admin details on their respective database connection
        /// Created by: Merajuddin khan
        /// Created on:21-01-22
        /// </summary>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        private async Task<string> InsertAdminDetailsOnTenantDataBase(TenantDBDetailsDto admindata)
        {
            List<UserCollectionForSubscription> users = new List<UserCollectionForSubscription>();
            users.Add(new UserCollectionForSubscription
            {
                FirstName = admindata.FirstName,
                LastName = admindata.LastName,
                UserName = admindata.UserName,
                EMailID = admindata.EMailID,
                AirlineSNo = 0,
                AirportSNo = 0,
                CitySNo = 0,
                GroupSNo = 0
            });
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("@NewPwd", admindata.Password);
            parameters[1] = new SqlParameter("@UserCollection", Newtonsoft.Json.JsonConvert.SerializeObject(users));

            var ds = await SqlHelper.ExecuteDatasetAsync(admindata.ConnectionString,
                        System.Data.CommandType.StoredProcedure,
                        "CreateUsersFromSubscription", parameters);

            if (ds.Tables[0].Rows[0][0] == "0")
            {
                await UpdateTenantSetUpPropcess(admindata.TenantId);
            }

            return "Success";
        }

        /// <summary>
        /// Desc:Update tenant admin setup proccess complete 
        /// Created by: Merajuddin khan
        /// Created on:24-01-22
        /// </summary>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        private async Task<string> UpdateTenantSetUpPropcess(int tenantId)
        {
            try
            {
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("TenantId", tenantId);
                parameters[1] = new SqlParameter("AdminCreationCompleted", true);

                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_UpdateTenantSetupProcess", parameters);
                return "success";
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return "success";
        }
    }
}
