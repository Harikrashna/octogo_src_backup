using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using CF.Octogo.Authorization;

namespace CF.Octogo
{
    /// <summary>
    /// Application layer module of the application.
    /// </summary>
    [DependsOn(
        typeof(OctogoApplicationSharedModule),
        typeof(OctogoCoreModule)
        )]
    public class OctogoApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Adding authorization providers
            Configuration.Authorization.Providers.Add<AppAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(OctogoApplicationModule).GetAssembly());
        }
    }
}