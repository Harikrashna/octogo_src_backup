namespace CF.Octogo.Services.Permission
{
    public interface IPermissionService
    {
        bool HasPermission(string key);
    }
}