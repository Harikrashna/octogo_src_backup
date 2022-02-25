using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Tenants.Dto
{
    public class TenantErrorMessage
    {
        public string TenantName { get; set; }
        public string ErrorMessage { get; set; }
        public int TenantId { get; set; }
        public long SetupId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string AdminEmail { get; set; }
        public string UserEmail { get; set; }
        public string ErrorLogProcess { get; set; }
        public string StackTrace { get; set; }

    }
}
