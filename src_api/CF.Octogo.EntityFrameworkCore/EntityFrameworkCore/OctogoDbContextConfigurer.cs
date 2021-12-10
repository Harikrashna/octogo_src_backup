using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace CF.Octogo.EntityFrameworkCore
{
    public static class OctogoDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<OctogoDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<OctogoDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}