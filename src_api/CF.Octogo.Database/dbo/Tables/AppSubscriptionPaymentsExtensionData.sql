CREATE TABLE [dbo].[AppSubscriptionPaymentsExtensionData] (
    [Id]                    BIGINT         IDENTITY (1, 1) NOT NULL,
    [SubscriptionPaymentId] BIGINT         NOT NULL,
    [Key]                   NVARCHAR (450) NULL,
    [Value]                 NVARCHAR (MAX) NULL,
    [IsDeleted]             BIT            NOT NULL,
    CONSTRAINT [PK_AppSubscriptionPaymentsExtensionData] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_AppSubscriptionPaymentsExtensionData_SubscriptionPaymentId_Key_IsDeleted]
    ON [dbo].[AppSubscriptionPaymentsExtensionData]([SubscriptionPaymentId] ASC, [Key] ASC, [IsDeleted] ASC) WHERE ([Key] IS NOT NULL);

