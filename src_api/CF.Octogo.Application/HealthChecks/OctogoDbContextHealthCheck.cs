using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using CF.Octogo.EntityFrameworkCore;

namespace CF.Octogo.HealthChecks
{
    public class OctogoDbContextHealthCheck : IHealthCheck
    {
        private readonly DatabaseCheckHelper _checkHelper;

        public OctogoDbContextHealthCheck(DatabaseCheckHelper checkHelper)
        {
            _checkHelper = checkHelper;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            if (_checkHelper.Exist("db"))
            {
                return Task.FromResult(HealthCheckResult.Healthy("OctogoDbContext connected to database."));
            }

            return Task.FromResult(HealthCheckResult.Unhealthy("OctogoDbContext could not connect to database"));
        }
    }
}
