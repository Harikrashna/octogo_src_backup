using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using CF.Octogo.Authorization.Roles;
using CF.Octogo.Authorization.Users;
using CF.Octogo.Data;
using CF.Octogo.Tenants.Dto;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
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
        private readonly IUserEmailer _userEmailer;
        private readonly IRepository<UserRole, long> _userRolesRepository;
        public TenantDetailsAppService(
            IRepository<UserRole, long> userRolesRepository,
            IUnitOfWorkManager UnitOfWorkManager,
             RoleManager roleManager,
            UserManager userManager,
                IUserEmailer userEmailer
            )
        {
            _userRolesRepository = userRolesRepository;
            _unitOfWorkManager = UnitOfWorkManager;
            _roleManager = roleManager;
            _userManager = userManager;
            _userEmailer = userEmailer;
        }
        public async Task<PageDetailsWithProduct> GetPageSnoByTenantAndProductId(TenantProductInputDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("TenantId", input.TenantId);
            parameters[1] = new SqlParameter("ProductId", input.ProductId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetPageSnoByTenantAndProductId", parameters
                    );
            if (ds.Tables[0].Rows.Count > 0)
            {
                PageDetailsWithProduct pageDetailsWithProduct = new PageDetailsWithProduct();
                pageDetailsWithProduct.TenantID = input.TenantId;
                pageDetailsWithProduct.PackageID = Convert.ToInt32(ds.Tables[0].Rows[0]["EditionId"]);
                    //var pageList = ds.Tables[0].AsEnumerable().Select(e => new PageDetails
                    //{
                    //    PageSno = Convert.ToInt32(e["pageSno"])
                    //});
                    pageDetailsWithProduct.PageDetails = JsonConvert.DeserializeObject<List<PageDetails>>(ds.Tables[0].Rows[0]["Pages"].ToString()).ToList();
                return pageDetailsWithProduct;
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
        /// 
        [UnitOfWork]
        public async Task<List<TenantAdminCreationStatusDto>> CreateAdminUserOnTenantDB(int? tenantId = null)
        {
            List<TenantAdminCreationStatusDto> response = new List<TenantAdminCreationStatusDto>();
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("TenantId", tenantId);
            parameters[1] = new SqlParameter("AdminCreationCompleted", false);
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
                   foreach (var tenantDetails in result)
                   {
                        using (_unitOfWorkManager.Current.SetTenantId(tenantDetails.TenantId))
                        {
                            //var userData = _userRolesRepository.GetAll().Where(obj => obj.);
                            var roleId = _roleManager.Roles.Where(obj => obj.DisplayName.ToLower() == "admin").FirstOrDefault().Id;
                            var userId = _userRolesRepository.GetAll().Where(obj => obj.RoleId == roleId).FirstOrDefault().UserId;
                            var userData = _userManager.GetUserById(userId);
                            var tenantadminDetails = result.Select(rw => new TenantDbAndUserDetailsDto
                            {
                                UserName = userData.UserName,
                                Password = userData.Password,
                                TenantId = (int)userData.TenantId,
                                ConnectionString = tenantDetails.ConnectionString,
                                FirstName = userData.Name,
                                LastName = userData.Surname,
                                EMailID = userData.EmailAddress

                            }).FirstOrDefault();
                            try
                            {
                                string ret_str = await InsertAdminDetailsOnTenantDataBase(tenantadminDetails);
                                if (ret_str == "Success")
                                {
                                    // set flag for Admin user details insert successfully to Tenant database
                                    await UpdateTenantSetUpProcess(tenantDetails.SetupId);
                                }
                                response.Add(new TenantAdminCreationStatusDto
                                {
                                    TenantId = tenantDetails.TenantId,
                                    Message = ret_str
                                });
                            }
                            catch(Exception e)
                            {
                                response.Add(new TenantAdminCreationStatusDto
                                {
                                    TenantId = tenantDetails.TenantId,
                                    Message = e.Message
                                });
                            }
                        }
                    }
                }

            }
            return response;
        }
        /// <summary>
        /// 
        /// Desc:Insert Tenant admin details on their respective database connection
        /// Created by: Merajuddin khan
        /// Created on:21-01-22
        /// </summary>
        /// <returns></returns>
        private async Task<string> InsertAdminDetailsOnTenantDataBase(TenantDbAndUserDetailsDto admindata)
        {
            List<UserCollectionForSubscription> users = new List<UserCollectionForSubscription>();
            users.Add(new UserCollectionForSubscription
            {
                FirstName = admindata.FirstName,
                LastName = admindata.LastName,
                UserName = admindata.UserName,
                EMailID = admindata.EMailID,
                CitySNo = 1692,
                GroupSNo = 14,
                AirlineSNo = 1,
                AirportSNo = 1703,
            });
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("@UsersTable", Newtonsoft.Json.JsonConvert.SerializeObject(users));
            parameters[1] = new SqlParameter("@NewPwd", admindata.Password);
            var jasonFormatData = Newtonsoft.Json.JsonConvert.SerializeObject(users);

                var ds = await SqlHelper.ExecuteDatasetAsync(admindata.ConnectionString.Trim(),
                            System.Data.CommandType.StoredProcedure,
                            "CreateUsersFromSubscription", parameters);

                if (ds.Tables[0].Rows[0][0].ToString() == "0")
                {
                    return "Success";
                }
                else
                {
                    return "failed to insert admin data. Response code is: " + ds.Tables[0].Rows[0][0].ToString();
                }
            
        }

        /// <summary>
        /// Desc:Update tenant admin setup proccess completed
        /// Created by: Merajuddin khan
        /// Created on:24-01-22
        /// </summary>
        /// <param name="setupId"></param>
        /// <returns></returns>
        private async Task UpdateTenantSetUpProcess(long setupId)
        {
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("SetupId", setupId);
                parameters[1] = new SqlParameter("AdminCreationCompleted", true);

                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_UpdateTenantSetupProcess", parameters);
        }
        /// <summary>
        /// Update SystemSettings for Package Update status after Tenant edition update or Edition update
        /// </summary>
        /// <param name="editionId"></param>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        public async Task UpdateTenantSyetemSettingForEditionUpdate(int editionId, int? tenantId, int? addonId = null)
        {
            await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                List<int> tenantIds = new List<int>();
                if (!tenantId.HasValue)
                {
                    // get all Tenants linked with updated Edition or Addon
                    List<TenantDetailResultDto> tenantResult = await GetTenantLinkedWithEdition(editionId, addonId);
                    if (tenantResult != null)
                    {
                        tenantIds = tenantResult.Select(obj => obj.TenantId).ToList();
                    }
                }
                else
                {
                    tenantIds.Add((int)tenantId);
                }
                foreach (int Id in tenantIds)
                {
                    SqlParameter[] parameters = new SqlParameter[2];
                    parameters[0] = new SqlParameter("TenantId", Id);
                    parameters[1] = new SqlParameter("AdminCreationCompleted", true);
                    var ds = await SqlHelper.ExecuteDatasetAsync(
                            Connection.GetSqlConnection("DefaultOctoGo"),
                            System.Data.CommandType.StoredProcedure,
                            "USP_GetTenantDataBaseDetails", parameters
                            );
                    if (ds.Tables.Count > 0)
                    {
                        var result = SqlHelper.ConvertDataTable<TenantDBDetailsDto>(ds.Tables[0]).FirstOrDefault();
                        if (result != null && result.TenantId > 0)
                        {
                            string connectionString = result.ConnectionString;
                            await SqlHelper.ExecuteDatasetAsync(
                                    Connection.GetSqlConnection(connectionString),
                                    System.Data.CommandType.Text,
                                    "UPDATE SystemSettings SET SysValue = 1 WHERE SysKey='IsPackageUpdated'"
                                    );
                        }
                    }
                }
            });
        }
        private async Task<List<TenantDetailResultDto>> GetTenantLinkedWithEdition(int editionId, int? addonId)
        {
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("EditionId", editionId);;
                parameters[1] = new SqlParameter("AddonId", addonId); ;
            var ds = await SqlHelper.ExecuteDatasetAsync(
                        Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_GetTenantsLinkedWithEdition", parameters);
            if (ds.Tables.Count > 0)
            {
                return SqlHelper.ConvertDataTable<TenantDetailResultDto>(ds.Tables[0]);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Desc:Get tenant proccess completion status
        /// created by : Merajuddin khan
        /// created on :08-02-22
        /// 
        /// </summary>
        /// <param name="setUpId"></param>
        /// <returns></returns>
        public async Task<DataSet> TenantAdminSetupProcessCompleteStatus(TenantSummaryInputDto input)
        {

            SqlParameter[] parameters = new SqlParameter[14];
            parameters[0] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[1] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[2] = new SqlParameter("TenantName", input.TenantName);
            parameters[3] = new SqlParameter("TenantId", input.TenantId);
            parameters[4] = new SqlParameter("ProductId", input.ProductId);
            parameters[5] = new SqlParameter("IsDBSetup", input.IsDBSetup);
            parameters[6] = new SqlParameter("IsAppURLSetup", input.IsAppURLSetup);
            parameters[7] = new SqlParameter("IsWSSetup", input.IsWSSetup);
            parameters[8] = new SqlParameter("IsApiURLSetup", input.IsApiURLSetUp);
            parameters[9] = new SqlParameter("IsAdminCreated", input.IsAdminCreated);
            parameters[10] = new SqlParameter("IsAppHosted", input.IsAppHosted);
            parameters[11] = new SqlParameter("IsCompleted", input.IsCompleted);
            parameters[12] = new SqlParameter("IsFailed", input.IsFailed);
            parameters[13] = new SqlParameter("IsProcess", input.IsProcess);
            var ds = await SqlHelper.ExecuteDatasetAsync(
               Connection.GetSqlConnection("DefaultOctoGo"),
               System.Data.CommandType.StoredProcedure,
               "USP_GetTenantProcessLogs", parameters
               );
            if (ds.Tables[0].Rows.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }

        }

        public async Task<string> CheckTeanantSetUpProcessAndErrorMessage()
        {
                var ds = await SqlHelper.ExecuteDatasetAsync(
                   Connection.GetSqlConnection("DefaultOctoGo"),
                   System.Data.CommandType.StoredProcedure,
                   "USP_CheckTeanantErrorMessage"
                   );
                if (ds.Tables[0].Rows.Count > 0)
                {
                    var tenantDetails = SqlHelper.ConvertDataTable<TenantErrorMessage>(ds.Tables[0]);
                    foreach (var result in tenantDetails)
                    {
                        if (result.ErrorMessage != null)
                        {
                            TenantErrorMessage tenantErrorMessagelist = new TenantErrorMessage();
                            tenantErrorMessagelist.TenantId = result.TenantId;
                            tenantErrorMessagelist.TenantName = result.TenantName;
                            tenantErrorMessagelist.LastName = result.LastName;
                            tenantErrorMessagelist.Name = result.Name;
                            tenantErrorMessagelist.AdminEmail = result.AdminEmail;
                            tenantErrorMessagelist.UserEmail = result.UserEmail;
                            tenantErrorMessagelist.ErrorMessage = result.ErrorMessage;
                            tenantErrorMessagelist.ErrorLogProcess = result.ErrorLogProcess;
                            tenantErrorMessagelist.StackTrace = result.StackTrace;
                            await _userEmailer.SendAdminSetUpFailedEmailAsync(tenantErrorMessagelist);
                            await UpdateErrorMailFlag(result.SetupId);
                        }
                    }
                    return "suceess";
                }
                else
                    return null;
        }
        private async Task<string> UpdateErrorMailFlag(long setUpId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("SetupId", setUpId); ;

            var ds = await SqlHelper.ExecuteDatasetAsync(
                        Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_UpdateErrorEmailFlag", parameters);
            return ds.Tables.Count > 0? "success": null;
           
        }
        private async Task<string> UpdateTenantEmailSendFlag(long setUpId)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("EmailSendFlag", "EmailSended"); ;
            parameters[1] = new SqlParameter("SetupId", setUpId); ;
          
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            CommandType.StoredProcedure,"USP_UpdateTenantSetupProcess", parameters);
            return ds.Tables.Count > 0?"success":null;
               
        }
        public async Task<string> CheckTeanantSetUpProcessAndSuccessMail()
            {
                
                    var ds = await SqlHelper.ExecuteDatasetAsync(
                       Connection.GetSqlConnection("DefaultOctoGo"),
                       System.Data.CommandType.StoredProcedure,
                       "USP_CheckTenantSetUpProcessAndEmailFlag"
                       );
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        var result = SqlHelper.ConvertDataTable<TenantSuccesMailDto>(ds.Tables[0]);
                        foreach (var tenantDetails in result)
                        {
                            TenantSuccessMail tenantSuccessMessageList = new TenantSuccessMail();
                            tenantSuccessMessageList.EmailAddress = tenantDetails.EmailAddress;
                            tenantSuccessMessageList.ProductName = tenantDetails.ProductName;
                            tenantSuccessMessageList.ProductLink = tenantDetails.ProductLink;
                            await _userEmailer.SendAdminSetUpCompleteEmailAsync(tenantSuccessMessageList);
                            await UpdateTenantEmailSendFlag(tenantDetails.SetupId);
                        }
                    
                            return "success";
                        }
                    else
                        return null;
                
            }
        }
    }
