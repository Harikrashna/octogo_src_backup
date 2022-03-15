using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Tenants.Dto
{
    public class TenantSuccessMail
    {
        public string TenantName { get; set; }
        public int TenantId { get; set; }
        public string ProductName { get; set; }
        public long SetupId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string ProductLink { get;set; }
        public string EmailAddress { get; set; }

    }
}
