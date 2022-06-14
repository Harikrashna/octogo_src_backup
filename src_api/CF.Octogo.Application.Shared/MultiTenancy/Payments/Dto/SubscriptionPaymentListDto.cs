﻿using Abp.Application.Services.Dto;

namespace CF.Octogo.MultiTenancy.Payments.Dto
{
    public class SubscriptionPaymentListDto : AuditedEntityDto
    {
        public string Gateway { get; set; }

        public decimal Amount { get; set; }

        public int EditionId { get; set; }

        public int DayCount { get; set; }

        public string PaymentPeriodType { get; set; }

        public string ExternalPaymentId { get; set; }

        public string PayerId { get; set; }

        public string Status { get; set; }

        public string EditionDisplayName { get; set; }

        public int TenantId { get; set; }

        public string InvoiceNo { get; set; }

    }
    public class SubscriptionPaymentListNewRet
    {
        public long PaymentId { get; set; }
        public int Gateway { get; set; }

        public decimal Amount { get; set; }

        public int EditionId { get; set; }

        public int DayCount { get; set; }

        public string PaymentPeriodType { get; set; }

        public int Status { get; set; }

        public string EditionName { get; set; }
        public string AddonName { get; set; }

        public int TenantId { get; set; }

        public string InvoiceNo { get; set; }
        public int TotalCount { get; set; }
        public string Description { get; set; }

    }
    public class SubscriptionPaymentListNewDto : AuditedEntityDto
    {
        public long PaymentId { get; set; }
        public string Gateway { get; set; }
        public decimal Amount { get; set; }
        public int EditionId { get; set; }
        public int DayCount { get; set; }
        public string PaymentPeriodType { get; set; }
        public string Status { get; set; }
        public string EditionName { get; set; }
        public string AddonName { get; set; }
        public int TenantId { get; set; }
        public string InvoiceNo { get; set; }
        public string Description { get; set; }

    }
}
