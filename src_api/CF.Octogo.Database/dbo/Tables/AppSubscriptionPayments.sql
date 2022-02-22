CREATE TABLE [dbo].[AppSubscriptionPayments] (
    [Id]                   BIGINT          IDENTITY (1, 1) NOT NULL,
    [Amount]               DECIMAL (18, 2) NOT NULL,
    [CreationTime]         DATETIME2 (7)   NOT NULL,
    [CreatorUserId]        BIGINT          NULL,
    [DayCount]             INT             NOT NULL,
    [DeleterUserId]        BIGINT          NULL,
    [DeletionTime]         DATETIME2 (7)   NULL,
    [EditionId]            INT             NOT NULL,
    [Gateway]              INT             NOT NULL,
    [IsDeleted]            BIT             NOT NULL,
    [LastModificationTime] DATETIME2 (7)   NULL,
    [LastModifierUserId]   BIGINT          NULL,
    [SuccessUrl]           NVARCHAR (MAX)  NULL,
    [PaymentPeriodType]    INT             NULL,
    [Status]               INT             NOT NULL,
    [TenantId]             INT             NOT NULL,
    [InvoiceNo]            NVARCHAR (MAX)  NULL,
    [Description]          NVARCHAR (MAX)  NULL,
    [ErrorUrl]             NVARCHAR (MAX)  NULL,
    [ExternalPaymentId]    NVARCHAR (450)  NULL,
    [IsRecurring]          BIT             DEFAULT (CONVERT([bit],(0))) NOT NULL,
    [EditionPaymentType]   INT             DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_AppSubscriptionPayments] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AppSubscriptionPayments_AbpEditions_EditionId] FOREIGN KEY ([EditionId]) REFERENCES [dbo].[AbpEditions] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AppSubscriptionPayments_EditionId]
    ON [dbo].[AppSubscriptionPayments]([EditionId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppSubscriptionPayments_ExternalPaymentId_Gateway]
    ON [dbo].[AppSubscriptionPayments]([ExternalPaymentId] ASC, [Gateway] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppSubscriptionPayments_Status_CreationTime]
    ON [dbo].[AppSubscriptionPayments]([Status] ASC, [CreationTime] ASC);

