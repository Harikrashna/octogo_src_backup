using Abp.Runtime.Validation;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Designation.Dto
{
    public class GetDesignationInput : PagedAndSortedInputDto, IShouldNormalize
    {

        public string filter { get; set; }

        public void Normalize()
        {

            filter = filter?.Trim();
        }
    }
}
