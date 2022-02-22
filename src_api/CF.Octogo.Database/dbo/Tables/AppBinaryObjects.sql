CREATE TABLE [dbo].[AppBinaryObjects] (
    [Id]          UNIQUEIDENTIFIER NOT NULL,
    [Bytes]       VARBINARY (MAX)  NOT NULL,
    [TenantId]    INT              NULL,
    [Description] NVARCHAR (MAX)   NULL,
    CONSTRAINT [PK_AppBinaryObjects] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AppBinaryObjects_TenantId]
    ON [dbo].[AppBinaryObjects]([TenantId] ASC);

