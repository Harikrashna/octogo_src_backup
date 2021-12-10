using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace CF.Octogo.Web.Public.Views
{
    public abstract class OctogoRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected OctogoRazorPage()
        {
            LocalizationSourceName = OctogoConsts.LocalizationSourceName;
        }
    }
}
