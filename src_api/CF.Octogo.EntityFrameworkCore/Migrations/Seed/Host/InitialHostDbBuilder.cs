using CF.Octogo.EntityFrameworkCore;

namespace CF.Octogo.Migrations.Seed.Host
{
    public class InitialHostDbBuilder
    {
        private readonly OctogoDbContext _context;

        public InitialHostDbBuilder(OctogoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            new DefaultEditionCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();

            _context.SaveChanges();
        }
    }
}
