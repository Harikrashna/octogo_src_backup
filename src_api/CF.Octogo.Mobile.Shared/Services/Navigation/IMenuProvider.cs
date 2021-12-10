using System.Collections.Generic;
using MvvmHelpers;
using CF.Octogo.Models.NavigationMenu;

namespace CF.Octogo.Services.Navigation
{
    public interface IMenuProvider
    {
        ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
    }
}