using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using Microsoft.Extensions.Configuration;
//using CF.Octogo.EntityFrameworkCore;

namespace CF.Octogo.Data
{
    public sealed class Connection
    {
        //public  Connection(OctogoEntityFrameworkCoreModule abpZeroTemplateEntityFrameworkCoreModule) {
        //    abpZeroTemplateEntityFrameworkCoreModule.SkipDbContextRegistration = true;
        //}
        public static string Default() {
            var configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();
            string connectionString = configuration.GetConnectionString("DefaultOctoGo");
            return connectionString;// new SqlConnection(connectionString);
        }

        public static SqlConnection GetSqlConnection(string Name= "DefaultOctoGo")
        {
            IConfigurationRoot configuration = (new ConfigurationBuilder())
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();
            string connectionString = configuration.GetConnectionString(Name);
            return new SqlConnection(connectionString);
        }
    }
}
