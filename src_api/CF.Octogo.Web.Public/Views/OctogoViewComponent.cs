using Abp.AspNetCore.Mvc.ViewComponents;

namespace CF.Octogo.Web.Public.Views
{
    public abstract class OctogoViewComponent : AbpViewComponent
    {
        protected OctogoViewComponent()
        {
            LocalizationSourceName = OctogoConsts.LocalizationSourceName;
        }
    }
}