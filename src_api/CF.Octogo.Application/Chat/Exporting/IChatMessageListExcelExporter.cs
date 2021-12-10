using System.Collections.Generic;
using Abp;
using CF.Octogo.Chat.Dto;
using CF.Octogo.Dto;

namespace CF.Octogo.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
