using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.Product.Dto;
using CF.Octogo.Product.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.Product
{
    public interface IProductAppService : IApplicationService
    {
        Task<PagedResultDto<ProductListDto>> GetProduct(PagedAndSortedInputDto input, string filter);
        //Task<int> CreateorUpdateProduct(CreateOrUpdateProductInput inp);
        Task<int> CreateorUpdateProduct(CreateOrUpdateProductInput inp);
        Task DeleteProduct(EntityDto input);
        Task<ProductandUserEdit> GetProductForEdit(GetEditProductinput input);
        Task<DataSet> GetProductByProductId(int? inProductID, string vcProductName);
        Task<List<ProductModulesDto>> GetProductModuleList(int InProductID);
    }
}
