using CF.Octogo.Editions.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Addons.Dto
{
    public class FeatureTreeEditModel
    {
        public List<FlatFeatureDto> Features { get; set; }
        public object FeatureValues { get; set; }
    }
}
