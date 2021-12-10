using System.Threading.Tasks;
using Abp.Dependency;

namespace CF.Octogo.MultiTenancy.Accounting
{
    public interface IInvoiceNumberGenerator : ITransientDependency
    {
        Task<string> GetNewInvoiceNumber();
    }
}