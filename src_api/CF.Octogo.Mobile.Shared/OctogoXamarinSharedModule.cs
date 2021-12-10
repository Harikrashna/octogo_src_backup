using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CF.Octogo
{
    [DependsOn(typeof(OctogoClientModule), typeof(AbpAutoMapperModule))]
    public class OctogoXamarinSharedModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Localization.IsEnabled = false;
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OctogoXamarinSharedModule).GetAssembly());
        }
    }
}