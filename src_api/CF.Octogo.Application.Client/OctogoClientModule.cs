using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CF.Octogo
{
    public class OctogoClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OctogoClientModule).GetAssembly());
        }
    }
}
