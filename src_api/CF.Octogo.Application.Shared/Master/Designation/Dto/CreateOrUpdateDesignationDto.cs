using Abp.Runtime.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Designation.Dto
{
    public class CreateOrUpdateDesignationDto : IShouldNormalize
    {
        public int? DesignationId { get; set; }
        public string DesignationName { get; set; }
        public string Description { get; set; }
        public void Normalize()
        {
            DesignationName = DesignationName.Trim();
        }
    }
}
