using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CF.Octogo.Startup
{
    [DependsOn(typeof(OctogoCoreModule))]
    public class OctogoGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OctogoGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}