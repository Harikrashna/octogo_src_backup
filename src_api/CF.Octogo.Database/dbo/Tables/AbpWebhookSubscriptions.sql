CREATE TABLE [dbo].[AbpWebhookSubscriptions] (
    [Id]            UNIQUEIDENTIFIER NOT NULL,
    [CreationTime]  DATETIME2 (7)    NOT NULL,
    [CreatorUserId] BIGINT           NULL,
    [TenantId]      INT              NULL,
    [WebhookUri]    NVARCHAR (MAX)   NOT NULL,
    [Secret]        NVARCHAR (MAX)   NOT NULL,
    [IsActive]      BIT              NOT NULL,
    [Webhooks]      NVARCHAR (MAX)   NULL,
    [Headers]       NVARCHAR (MAX)   NULL,
    CONSTRAINT [PK_AbpWebhookSubscriptions] PRIMARY KEY CLUSTERED ([Id] ASC)
);

