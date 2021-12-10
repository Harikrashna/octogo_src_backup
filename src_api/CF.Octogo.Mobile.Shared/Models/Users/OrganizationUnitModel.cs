using Abp.AutoMapper;
using CF.Octogo.Organizations.Dto;

namespace CF.Octogo.Models.Users
{
    [AutoMapFrom(typeof(OrganizationUnitDto))]
    public class OrganizationUnitModel : OrganizationUnitDto
    {
        public bool IsAssigned { get; set; }
    }
}