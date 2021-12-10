using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CF.Octogo
{
    [DependsOn(typeof(OctogoCoreSharedModule))]
    public class OctogoApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OctogoApplicationSharedModule).GetAssembly());
        }
    }
}