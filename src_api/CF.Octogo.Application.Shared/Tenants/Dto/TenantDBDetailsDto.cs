using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Tenants.Dto
{
    public class TenantDBDetailsDto
    {
        public long SetupId { get; set; }
        public int ProductId { get; set; }
        public string ConnectionStringName { get; set; }
        public string DbName { get; set; }
        public string ProciderName { get; set; }
        public string ConnectionString { get; set; }
        public int TenantId { get; set; }
        

    }
    public class TenantDbAndUserDetailsDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string EMailID { get; set; }
        public string ConnectionString { get; set; }
        public string Password { get; set; }
        public int TenantId { get; set; }
        
    }
    public class UserCollectionForSubscription
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string EMailID { get; set; }
        public int CitySNo { get; set; }
        public int GroupSNo { get; set; }
        public int AirlineSNo { get; set; }
        public int AirportSNo { get; set; }
    }
    public class TenantAdminCreationStatusDto
    {
        public string Message { get; set; }
        public int TenantId { get; set; }
    }
}
