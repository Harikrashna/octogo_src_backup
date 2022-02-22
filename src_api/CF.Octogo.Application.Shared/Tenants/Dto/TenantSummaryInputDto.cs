using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Tenants.Dto
{
    public class TenantSummaryInputDto
    {
        public int MaxResultCount { get; set; }
        public int SkipCount { get; set; } = 0;
        public string TenantName { get; set; }
        public int? TenantId { get; set; }
        public int? ProductId { get; set; }
        public bool? IsDBSetup { get; set; }
        public bool? IsAppURLSetup { get; set; }
        public bool? IsWSSetup { get; set; }
        public bool? IsApiURLSetUp { get; set; }
        public bool? IsAdminCreated { get; set; }
        public bool? IsEmailSend { get; set; }
        public bool? IsAppHosted { get; set; }
        public string ErrorMessage { get; set; }

        public bool? IsCompleted { get; set; }
        public bool? IsFailed { get; set; }
        public bool? IsProcess { get; set; }
    }
}
