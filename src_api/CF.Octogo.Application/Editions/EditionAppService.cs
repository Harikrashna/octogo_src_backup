﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.BackgroundJobs;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using CF.Octogo.Authorization;
using CF.Octogo.Editions.Dto;
using CF.Octogo.MultiTenancy;
using CF.Octogo.Data;
using System.Data;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System;
using Abp.Domain.Uow;

namespace CF.Octogo.Editions
{
    public class EditionAppService : OctogoAppServiceBase, IEditionAppService
    {
        private readonly EditionManager _editionManager;
        private readonly IRepository<SubscribableEdition> _editionRepository;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;
        public IAbpSession AbpSession { get; set; }

        public EditionAppService(
            EditionManager editionManager,
            IRepository<SubscribableEdition> editionRepository,
            IRepository<Tenant> tenantRepository,
            IBackgroundJobManager backgroundJobManager)
        {
            _editionManager = editionManager;
            _editionRepository = editionRepository;
            _tenantRepository = tenantRepository;
            _backgroundJobManager = backgroundJobManager;
            AbpSession = NullAbpSession.Instance;
        }

        [AbpAuthorize(AppPermissions.Pages_Editions)]
        public async Task<ListResultDto<EditionListDto>> GetEditions()
        {
            // var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"), System.Data.CommandType.Text, "Select * from AbpEditions");
            var editions = await (from edition in _editionRepository.GetAll()
                                  join expiringEdition in _editionRepository.GetAll() on edition.ExpiringEditionId equals expiringEdition.Id into expiringEditionJoined
                                  from expiringEdition in expiringEditionJoined.DefaultIfEmpty()
                                  select new
                                  {
                                      Edition = edition,
                                      expiringEditionDisplayName = expiringEdition.DisplayName
                                  }).ToListAsync();

            var result = new List<EditionListDto>();

            foreach (var edition in editions)
            {
                var resultEdition = ObjectMapper.Map<EditionListDto>(edition.Edition);
                resultEdition.ExpiringEditionDisplayName = edition.expiringEditionDisplayName;

                result.Add(resultEdition);
            }

            return new ListResultDto<EditionListDto>(result);
        }

        [AbpAuthorize(AppPermissions.Pages_Editions_Create, AppPermissions.Pages_Editions_Edit)]
        public async Task<GetEditionEditOutput> GetEditionForEdit(NullableIdDto input)
        {
            var features = FeatureManager.GetAll()
                .Where(f => f.Scope.HasFlag(FeatureScopes.Edition));

            EditionEditDto editionEditDto;
            List<NameValue> featureValues;

            if (input.Id.HasValue) //Editing existing edition?
            {
                var edition = await _editionManager.FindByIdAsync(input.Id.Value);
                featureValues = (await _editionManager.GetFeatureValuesAsync(input.Id.Value)).ToList();
                editionEditDto = ObjectMapper.Map<EditionEditDto>(edition);
            }
            else
            {
                editionEditDto = new EditionEditDto();
                featureValues = features.Select(f => new NameValue(f.Name, f.DefaultValue)).ToList();
            }

            var featureDtos = ObjectMapper.Map<List<FlatFeatureDto>>(features).OrderBy(f => f.DisplayName).ToList();

            return new GetEditionEditOutput
            {
                Edition = editionEditDto,
                Features = featureDtos,
                FeatureValues = featureValues.Select(fv => new NameValueDto(fv)).ToList()
            };
        }

        [AbpAuthorize(AppPermissions.Pages_Editions_Create)]
        [UnitOfWork(IsDisabled =true)]
        public async Task CreateEdition(CreateEditionDto input)
        {
            await InsertUpdateEdition(input);
        }

        [AbpAuthorize(AppPermissions.Pages_Editions_Edit)]
        public async Task UpdateEdition(UpdateEditionDto input)
        {
            await UpdateEditionAsync(input);
        }

        [AbpAuthorize(AppPermissions.Pages_Editions_Delete)]
        public async Task DeleteEdition(EntityDto input)
        {
            var tenantCount = await _tenantRepository.CountAsync(t => t.EditionId == input.Id);
            if (tenantCount > 0)
            {
                throw new UserFriendlyException(L("ThereAreTenantsSubscribedToThisEdition"));
            }
            var dependentEditionCount = await CheckEditionDependency(input.Id);
            if (dependentEditionCount > 0)
            {
                throw new UserFriendlyException(L("ThereAreDependentEdition"));
            }
            var edition = await _editionManager.GetByIdAsync(input.Id);
            await _editionManager.DeleteAsync(edition);
            await DeleteEditionData(input.Id);
        }
        public async Task DeleteEditionData(int EditionId)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            parameters[1] = new SqlParameter("LoginUserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "DeleteEditionData", parameters
                    );
        }
        [AbpAuthorize(AppPermissions.Pages_Editions_MoveTenantsToAnotherEdition)]
        public async Task MoveTenantsToAnotherEdition(MoveTenantsToAnotherEditionDto input)
        {
            await _backgroundJobManager.EnqueueAsync<MoveTenantsToAnotherEditionJob, MoveTenantsToAnotherEditionJobArgs>(new MoveTenantsToAnotherEditionJobArgs
            {
                SourceEditionId = input.SourceEditionId,
                TargetEditionId = input.TargetEditionId,
                User = AbpSession.ToUserIdentifier()
            });
        }

        [AbpAuthorize(AppPermissions.Pages_Editions,AppPermissions.Pages_Tenants)]
        public async Task<List<SubscribableEditionComboboxItemDto>> GetEditionComboboxItems(int? selectedEditionId = null, bool addAllItem = false, bool onlyFreeItems = false)
        {
            var editions = await _editionManager.Editions.ToListAsync();
            var subscribableEditions = editions.Cast<SubscribableEdition>()
                .WhereIf(onlyFreeItems, e => e.IsFree)
                .OrderBy(e => e.MonthlyPrice);

            var editionItems =
                new ListResultDto<SubscribableEditionComboboxItemDto>(subscribableEditions
                    .Select(e => new SubscribableEditionComboboxItemDto(e.Id.ToString(), e.DisplayName, e.IsFree)).ToList()).Items.ToList();

            var defaultItem = new SubscribableEditionComboboxItemDto("", L("NotAssigned"), null);
            editionItems.Insert(0, defaultItem);

            if (addAllItem)
            {
                editionItems.Insert(0, new SubscribableEditionComboboxItemDto("-1", "- " + L("All") + " -", null));
            }

            if (selectedEditionId.HasValue)
            {
                var selectedEdition = editionItems.FirstOrDefault(e => e.Value == selectedEditionId.Value.ToString());
                if (selectedEdition != null)
                {
                    selectedEdition.IsSelected = true;
                }
            }
            else
            {
                editionItems[0].IsSelected = true;
            }

            return editionItems;
        }

        public async Task<int> GetTenantCount(int editionId)
        {
            return await _tenantRepository.CountAsync(t => t.EditionId == editionId);
        }

        [AbpAuthorize(AppPermissions.Pages_Editions_Create)]

        protected virtual async Task CreateEditionAsync(CreateEditionDto input)
        {
            var edition = ObjectMapper.Map<SubscribableEdition>(input.Edition);

            if (edition.ExpiringEditionId.HasValue)
            {
                var expiringEdition = (SubscribableEdition)await _editionManager.GetByIdAsync(edition.ExpiringEditionId.Value);
                if (!expiringEdition.IsFree)
                {
                    throw new UserFriendlyException(L("ExpiringEditionMustBeAFreeEdition"));
                }
            }

            await _editionManager.CreateAsync(edition);
            CurrentUnitOfWork.SaveChanges(); //It's done to get Id of the edition.

            await SetFeatureValues(edition, input.FeatureValues);
        }
        protected virtual async Task InsertUpdateEdition(CreateEditionDto input)
        {
            bool isEdit = false;
            if(input.Edition.Id > 0)
            {
                isEdit = true;
            }
            input.isEdit = isEdit;
            if (input.Edition.ExpiringEditionId > 0)
            {
                var expiringEdition = GetEditionsByProductId(input.ProductId, input.Edition.ExpiringEditionId, "PAID");
                if (expiringEdition.Result.Items.Count > 0)
                {
                    throw new UserFriendlyException(L("ExpiringEditionMustBeAFreeEdition"));
                }
            }
            var edition = ObjectMapper.Map<SubscribableEdition>(input.Edition);
            if (isEdit == false)
            {
                await _editionManager.CreateAsync(edition);
                // CurrentUnitOfWork.SaveChanges(); //It's done to get Id of the edition.

                input.Edition.Id = edition.Id;
            }
            await InsertUpdateEditionModuleAndPricing(input);
            if (edition.Id > 0)
            {
                _editionManager.SetFeatureValuesAsync((int)input.Edition.Id, input.FeatureValues.Select(fv => new NameValue(fv.Name, fv.Value)).ToArray());
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Editions_Edit)]
        protected virtual async Task UpdateEditionAsync(UpdateEditionDto input)
        {
            if (input.Edition.Id != null)
            {
                var edition = await _editionManager.GetByIdAsync(input.Edition.Id.Value);

                edition.DisplayName = input.Edition.DisplayName;

                await SetFeatureValues(edition, input.FeatureValues);
            }
        }
        [RequiresFeature("SampleFeature")]
        private Task SetFeatureValues(Edition edition, List<NameValueDto> featureValues)
        {
            return _editionManager.SetFeatureValuesAsync(edition.Id,
                featureValues.Select(fv => new NameValue(fv.Name, fv.Value)).ToArray());
        }
        public async Task<ListResultDto<PricingTypeDto>> GetPricingTypes()
        {
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.Text,
                    "SELECT inPricingTypeId [Id],vcTypeName [Name],inNoOfDays [NoOfDays] FROM TblMst_PricingType  WHERE btIsActive = 1 ORDER BY inNoOfDays"
                    );
            if(ds.Tables.Count > 0)
            {
                return new ListResultDto<PricingTypeDto> (SqlHelper.ConvertDataTable<PricingTypeDto>(ds.Tables[0]));
            }
            else
            {
                return null;
            }
        }

        public async Task<int> InsertUpdateEditionModuleAndPricing(CreateEditionDto input)
        {
            var edition = GetEditionsByProductId(input.ProductId, input.Edition.Id);
            if (edition.Result.Items.Where(o => o.DisplayName.ToLower() == input.Edition.DisplayName.ToLower()).ToList().Count > 0)
            {
                throw new UserFriendlyException(L("ProductEditionDuplicate"));
            }
            else
            {
                try
                {
                    SqlParameter[] parameters = new SqlParameter[12];
                    parameters[0] = new SqlParameter("ProductId", input.ProductId);
                    parameters[1] = new SqlParameter("ModuleData", JsonConvert.SerializeObject(input.ModuleList));
                    parameters[2] = new SqlParameter("PricingData", input.priceDiscount != null ? JsonConvert.SerializeObject(input.priceDiscount) : null);
                    parameters[3] = new SqlParameter("DependantEditionID", input.DependantEditionID);
                    parameters[4] = new SqlParameter("LoginUserId", AbpSession.UserId);
                    parameters[5] = new SqlParameter("ApproachId", input.ApproachId);
                    parameters[6] = new SqlParameter("EditionId", input.Edition.Id);
                    parameters[7] = new SqlParameter("Name", input.Edition.DisplayName);
                    parameters[8] = new SqlParameter("ExpiringEditionId", input.Edition.ExpiringEditionId);
                    parameters[9] = new SqlParameter("TrialDayCount", input.Edition.TrialDayCount);
                    parameters[10] = new SqlParameter("WaitingDayAfterExpire", input.Edition.WaitingDayAfterExpire);
                    parameters[11] = new SqlParameter("isEdit", input.isEdit);
                    var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                            System.Data.CommandType.StoredProcedure,
                            "InsertEditionModulesANDPricing", parameters);
                    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                    {
                        return (int)ds.Tables[0].Rows[0]["Id"];
                    }
                    else
                    {
                        return 0;
                    }
                }catch(Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }
            return 0;
        }
        public async Task<EditionDetailsForEditDto> getEditionDetailsForEdit(int EditionId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "GETEDITIONDATAFOREDIT", parameters
                    );
            if (ds.Tables.Count > 0)
            {
                    var result = SqlHelper.ConvertDataTable<EditionDetailsForEdit>(ds.Tables[0]);
                    return result.Select(rw => new EditionDetailsForEditDto
                    {
                        Id = rw.Id,
                        DisplayName = rw.DisplayName,
                        ExpiringEditionId = rw.ExpiringEditionId,
                        ProductId = rw.ProductId,
                        ApproachId = rw.ApproachId,
                        TrialDayCount = rw.TrialDayCount,
                        IsTrialActive = rw.IsTrialActive,
                        WaitingDayAfterExpire = rw.WaitingDayAfterExpire,
                        WaitAfterExpiry = rw.WaitAfterExpiry,
                        DependantEditionID = rw.DependantEditionID,
                        DependantEdition = rw.DependantEdition,
                        PricingData = rw.PricingData != null ? JsonConvert.DeserializeObject<List<ModulePricingDto>>(rw.PricingData.ToString()) : null
                    }).FirstOrDefault();
            }
            else
            {
                return null;
            }
        }

        public async Task<DataSet> GetOtherDataForEdition()
        {
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "GETOTHERDATAFOREDITION"
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
        public async Task<EditionModulesDto> getEditionModules(int EditionId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "GETEDITIONMODULES", parameters
                    );
            if (ds.Tables.Count > 0)
            {
                var ModuleDataRet = SqlHelper.ConvertDataTable<ModuleRet>(ds.Tables[0]);
                var DependEditionDataRet = SqlHelper.ConvertDataTable<DependEditionRet>(ds.Tables[1]);
                var ModuleData = ModuleDataRet.Select(rw => new ModuleDto
                {
                    ModuleId = rw.ModuleId,
                    ModuleName = rw.ModuleName,
                    PageModuleId = rw.PageModuleId,
                    SubModuleList = rw.SubModuleList != null ? JsonConvert.DeserializeObject<List<ModuleDto>>(rw.SubModuleList.ToString()) : null
                }).ToList();
                var DependEditionData = DependEditionDataRet.Select(rw => new DependEditionDto
                {
                    EditionId = rw.EditionId,
                    DisplayName = rw.DisplayName,
                    ModuleData = rw.ModuleData != null ? JsonConvert.DeserializeObject<List<ModuleDto>>(rw.ModuleData.ToString()) : null
                }).ToList();

                EditionModulesDto result = new EditionModulesDto();
                result.ModulesData = ModuleData;
                result.DependEditionData = DependEditionData;
                return result;
            }
            else
            {
                return null;
            }
        }

        public async Task<ListResultDto<EditionListByProductDto>> GetEditionsByProductId(int ProductId, int? EditionId, string PaidStatus=null)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("ProductId", ProductId);
            parameters[1] = new SqlParameter("EditionId", EditionId);
            parameters[2] = new SqlParameter("PaidStatus", PaidStatus);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "GetEditionsByProductId",parameters
                    );
            if (ds.Tables.Count > 0)
            {
                return new ListResultDto<EditionListByProductDto>(SqlHelper.ConvertDataTable<EditionListByProductDto>(ds.Tables[0]));
            }
            else
            {
                return null;
            }
        }
        public async Task<PagedResultDto<EditionListDtoNew>> GetEditionsList(GetEditionInput input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[1] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.Filter);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "GetEditionsList", parameters
                    );
            var totalCount = 0;
            var editionList = new List<EditionListDtoNew>();
            if (ds.Tables.Count > 0)
            {
                editionList = SqlHelper.ConvertDataTable<EditionListDtoNew>(ds.Tables[0]);
                DataRow row = ds.Tables[1].Rows[0];
                totalCount = Convert.ToInt32(row["totalCount"]);
            }
            return new PagedResultDto<EditionListDtoNew>(
                totalCount,
                editionList
            );
        }
        public async Task<ListResultDto<DependentEditionDto>> GetDependentEdition(int EditionId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "GetDependentEdition", parameters
                    );
            if (ds.Tables.Count > 0)
            {
                return new ListResultDto<DependentEditionDto>(SqlHelper.ConvertDataTable<DependentEditionDto>(ds.Tables[0]));
            }
            else
            {
                return null;
            }
        }
        public async Task<int> CheckEditionDependency(int EditionId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "CheckEditionDependency", parameters
                    );
            if (ds.Tables.Count > 0)
            {
                DataRow row = ds.Tables[0].Rows[0];
                return Convert.ToInt32(row["EditionCounts"]);
            }
            else
            {
                return 0;
            }
        }
        public async Task<ModuleSubModuleDto> GetModuleList()
        {
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "GetPageModulesList"
                    );
            if (ds.Tables.Count > 0)
            {
                var ModuleData = SqlHelper.ConvertDataTable<PageModulesDto>(ds.Tables[0]);
                var SubModuleDataRet = SqlHelper.ConvertDataTable<SubModulesRet>(ds.Tables[1]);
                var SubModuleData = SubModuleDataRet.Select(rw => new SubModulesDto
                {
                    ModuleId = rw.ModuleId,
                    SubModuleList = rw.SubModuleList != null ? JsonConvert.DeserializeObject<List<PageModulesDto>>(rw.SubModuleList.ToString()) : null
                }).ToList();
                ModuleSubModuleDto result = new ModuleSubModuleDto();
                result.ModuleList = ModuleData;
                result.SubModuleList = SubModuleData;
                return result;
            }
            else
            {
                return null;
            }
        }
    }
}