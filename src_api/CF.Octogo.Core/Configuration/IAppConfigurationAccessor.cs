using Microsoft.Extensions.Configuration;

namespace CF.Octogo.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
