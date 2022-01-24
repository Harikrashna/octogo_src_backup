using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.MultiTenancy.Dto
{
    public class InsertTenantEditionAddonDto
    {
        public int TenantId { get; set; }
        public int? EditionId { get; set; }
        public bool isEdit { get; set; } = false;
    }
}
