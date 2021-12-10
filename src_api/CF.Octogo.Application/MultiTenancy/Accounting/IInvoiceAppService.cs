using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using CF.Octogo.MultiTenancy.Accounting.Dto;

namespace CF.Octogo.MultiTenancy.Accounting
{
    public interface IInvoiceAppService
    {
        Task<InvoiceDto> GetInvoiceInfo(EntityDto<long> input);

        Task CreateInvoice(CreateInvoiceDto input);
    }
}
