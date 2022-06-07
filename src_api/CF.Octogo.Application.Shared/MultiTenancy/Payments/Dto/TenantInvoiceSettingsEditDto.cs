using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.MultiTenancy.Payments.Dto
{
 public   class TenantInvoiceSettingsEditDto
    {

        public int TenantId { get; set; }

        public string LegalName { get; set; }
        public string Address { get; set; }
        public string TaxVatNo { get; set; }
    }
}
