using System.Collections.Generic;
using CF.Octogo.Auditing.Dto;
using CF.Octogo.Dto;

namespace CF.Octogo.Auditing.Exporting
{
    public interface IAuditLogListExcelExporter
    {
        FileDto ExportToFile(List<AuditLogListDto> auditLogListDtos);

        FileDto ExportToFile(List<EntityChangeListDto> entityChangeListDtos);
    }
}
