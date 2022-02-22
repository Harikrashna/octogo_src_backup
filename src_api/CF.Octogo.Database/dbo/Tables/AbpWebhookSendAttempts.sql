CREATE TABLE [dbo].[AbpWebhookSendAttempts] (
    [Id]                    UNIQUEIDENTIFIER NOT NULL,
    [WebhookEventId]        UNIQUEIDENTIFIER NOT NULL,
    [WebhookSubscriptionId] UNIQUEIDENTIFIER NOT NULL,
    [Response]              NVARCHAR (MAX)   NULL,
    [ResponseStatusCode]    INT              NULL,
    [CreationTime]          DATETIME2 (7)    NOT NULL,
    [LastModificationTime]  DATETIME2 (7)    NULL,
    [TenantId]              INT              NULL,
    CONSTRAINT [PK_AbpWebhookSendAttempts] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpWebhookSendAttempts_AbpWebhookEvents_WebhookEventId] FOREIGN KEY ([WebhookEventId]) REFERENCES [dbo].[AbpWebhookEvents] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpWebhookSendAttempts_WebhookEventId]
    ON [dbo].[AbpWebhookSendAttempts]([WebhookEventId] ASC);

