using System;
using System.Collections.Generic;

namespace CF.Octogo.MultiTenancy.Accounting.Dto
{
    public class InvoiceDto
    {
        public decimal Amount { get; set; }

        public string EditionDisplayName { get; set; }
        
        public string InvoiceNo { get; set; }

        public DateTime InvoiceDate { get; set; }

        public string TenantLegalName { get; set; }

        public List<string> TenantAddress { get; set; }

        public string TenantTaxNo { get; set; }

        public string HostLegalName { get; set; }

        public List<string> HostAddress { get; set; }
    }
    public class InvoiceNewDto
    {
        public decimal Amount { get; set; }

        public string EditionName { get; set; }
        public string AddonName { get; set; }
        public string ProductName { get; set; }

        public string InvoiceNo { get; set; }

        public DateTime InvoiceDate { get; set; }

        public string TenantLegalName { get; set; }

        public string TenantAddress { get; set; }

        public string TenantTaxNo { get; set; }

        public string HostLegalName { get; set; }

        public string HostAddress { get; set; }
    }
}