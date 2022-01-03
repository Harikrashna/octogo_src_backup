namespace CF.Octogo.Authorization.Accounts.Dto
{
    public enum TenantAvailabilityState
    {
        Available = 1,
        InActive,
        NotFound
    }
    public enum TenantPyamenteSateAndAvailability
    {
        Completed = 1,
        NotCompleted,
        isFree,
        NotFound
    }
}