CREATE TABLE [dbo].[AbpWebhookEvents] (
    [Id]           UNIQUEIDENTIFIER NOT NULL,
    [WebhookName]  NVARCHAR (MAX)   NOT NULL,
    [Data]         NVARCHAR (MAX)   NULL,
    [CreationTime] DATETIME2 (7)    NOT NULL,
    [TenantId]     INT              NULL,
    [IsDeleted]    BIT              NOT NULL,
    [DeletionTime] DATETIME2 (7)    NULL,
    CONSTRAINT [PK_AbpWebhookEvents] PRIMARY KEY CLUSTERED ([Id] ASC)
);

