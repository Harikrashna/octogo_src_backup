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

    public class TenantProcessLogsList
    {
        public DateTime AdminCreationCompleteDt { get; set; }
        public string AdminEmail { get; set; }
        public string AdminName { get; set; }
        public string ApiURL { get; set; }
        public DateTime ApiurlSetupCompleteDt { get; set; }
        public string AppURAL { get; set; }
        public DateTime AppURLSetupCompleteDt { get; set; }
        public DateTime ApplicationHostDt { get; set; }
        public string DBName { get; set; }
        public DateTime DbSetupCompleteDt { get; set; }
        public string ErrorMessage { get; set; }
        public bool   IsAPIURLSetup { get; set; }
        public bool   IsAdminCreationCompleted { get; set; }
        public bool   IsAppURLSetup { get; set; }
        public bool   IsApplicationHost { get; set; }
        public bool   IsDBSetup { get; set; }
        public bool   IsWSSetup { get; set; }
        public int    ProductId { get; set; }
        public string ProductName { get; set; }
        public int    TenantId { get; set; }
        public string TenantName { get; set; }
        public int    TotalCount { get; set; }
        public DateTime WsSetupCompleteDt { get; set; }
    }
}