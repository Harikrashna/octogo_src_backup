using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CF.Octogo
{
    public class OctogoCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OctogoCoreSharedModule).GetAssembly());
        }
    }
}