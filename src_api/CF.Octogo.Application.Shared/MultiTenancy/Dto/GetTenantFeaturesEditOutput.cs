using System.Collections.Generic;
using Abp.Application.Services.Dto;
using CF.Octogo.Editions.Dto;

namespace CF.Octogo.MultiTenancy.Dto
{
    public class GetTenantFeaturesEditOutput
    {
        public List<NameValueDto> FeatureValues { get; set; }

        public List<FlatFeatureDto> Features { get; set; }
    }
}