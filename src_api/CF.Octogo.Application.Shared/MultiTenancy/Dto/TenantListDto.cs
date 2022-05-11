using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;

namespace CF.Octogo.MultiTenancy.Dto
{
    public class TenantListDto : EntityDto, IPassivable, IHasCreationTime
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }

        public string EditionDisplayName { get; set; }

        [DisableAuditing]
        public string ConnectionString { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreationTime { get; set; }

        public DateTime? SubscriptionEndDateUtc { get; set; }

        public int? EditionId { get; set; }

        public bool IsInTrialPeriod { get; set; }
    }
    public class TenantListNewRet : EntityDto, IPassivable, IHasCreationTime
    {
        public string TenancyName { get; set; }
        public string Name { get; set; }
        [DisableAuditing]
        public string ConnectionString { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreationTime { get; set; }
        public int TotalCount { get; set; }
        public string Edition { get; set; }
        public string UserTypeName { get; set; }
    }
    public class TenantListNewDto : EntityDto, IPassivable, IHasCreationTime
    {
        public string TenancyName { get; set; }
        public string Name { get; set; }
        [DisableAuditing]
        public string ConnectionString { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreationTime { get; set; }
        public List<SubscribedEditionDetailsDto> Edition { get; set; }
        public string UserTypeName { get; set; } //Added by : merajuddin
    }
    public class SubscribedEditionDetailsDto
    {
        public int EditionId { get; set; }
        public string EditionName { get; set; }
        public string Pricing { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public DateTime SubscriptionStartDateUtc { get; set; }
        public DateTime? SubscriptionEndDateUtc { get; set; }
        public string SetupStatus { get; set; }
        public string SetupErrorMsg { get; set; }
        public bool IsSetupCompleted { get; set; }
        public List<SubscribedAddonDetailsDto> Addon { get; set; }
    }
    public class SubscribedAddonDetailsDto
    {
        public int AddonId { get; set; }
        public string AddonName { get; set; }
        public string Pricing { get; set; }
        public DateTime SubscriptionStartDateUtc { get; set; }
        public DateTime? SubscriptionEndDateUtc { get; set; }
    }
}