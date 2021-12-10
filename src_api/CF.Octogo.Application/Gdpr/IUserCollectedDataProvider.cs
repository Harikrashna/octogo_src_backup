using System.Collections.Generic;
using System.Threading.Tasks;
using Abp;
using CF.Octogo.Dto;

namespace CF.Octogo.Gdpr
{
    public interface IUserCollectedDataProvider
    {
        Task<List<FileDto>> GetFiles(UserIdentifier user);
    }
}
