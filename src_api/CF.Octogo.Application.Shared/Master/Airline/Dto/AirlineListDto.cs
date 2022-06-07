using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Airline.Dto
{
    public class AirlineListDto
    {
        public int AirlineId { get; set; }

        public string CarrierCode { get; set; }

        public string AirlineName { get; set; }
        public bool IsInterline { get; set; }
        public bool Active { get; set; }
    }
}

