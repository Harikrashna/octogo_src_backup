using Abp.Domain.Services;

namespace CF.Octogo
{
    public abstract class OctogoDomainServiceBase : DomainService
    {
        /* Add your common members for all your domain services. */

        protected OctogoDomainServiceBase()
        {
            LocalizationSourceName = OctogoConsts.LocalizationSourceName;
        }
    }
}
