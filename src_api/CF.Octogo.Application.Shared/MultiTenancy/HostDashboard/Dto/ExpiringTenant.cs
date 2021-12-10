namespace CF.Octogo.MultiTenancy.HostDashboard.Dto
{
    public class ExpiringTenant
    {
        public string TenantName { get; set; }
        public int RemainingDayCount { get; set; }
    }
}