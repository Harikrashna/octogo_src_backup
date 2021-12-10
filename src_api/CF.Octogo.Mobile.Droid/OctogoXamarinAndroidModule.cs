using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CF.Octogo
{
    [DependsOn(typeof(OctogoXamarinSharedModule))]
    public class OctogoXamarinAndroidModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OctogoXamarinAndroidModule).GetAssembly());
        }
    }
}