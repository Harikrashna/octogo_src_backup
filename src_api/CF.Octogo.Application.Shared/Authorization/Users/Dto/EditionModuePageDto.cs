using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Authorization.Users.Dto
{
        public class EditionModuePageDto
        {

            public int PageId { get; set; }
            public string PageName { get; set; }

            public List<ChildPagesDto> ChildPages { get; set; }

        }

        public class EditionModuePageRet
    {
            public int PageId { get; set; }
            public string PageName { get; set; }
            public string ChildPages { get; set; }
        }

        public class ChildPagesDto
        {

            public int PageId { get; set; }
            public string PageName { get; set; }
        }
}
