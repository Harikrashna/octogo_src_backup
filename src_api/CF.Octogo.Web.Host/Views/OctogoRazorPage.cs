using Abp.AspNetCore.Mvc.Views;

namespace CF.Octogo.Web.Views
{
    public abstract class OctogoRazorPage<TModel> : AbpRazorPage<TModel>
    {
        protected OctogoRazorPage()
        {
            LocalizationSourceName = OctogoConsts.LocalizationSourceName;
        }
    }
}
