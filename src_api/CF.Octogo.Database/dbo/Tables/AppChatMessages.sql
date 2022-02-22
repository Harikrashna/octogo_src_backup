CREATE TABLE [dbo].[AppChatMessages] (
    [Id]                BIGINT           IDENTITY (1, 1) NOT NULL,
    [CreationTime]      DATETIME2 (7)    NOT NULL,
    [Message]           NVARCHAR (MAX)   NOT NULL,
    [ReadState]         INT              NOT NULL,
    [Side]              INT              NOT NULL,
    [TargetTenantId]    INT              NULL,
    [TargetUserId]      BIGINT           NOT NULL,
    [TenantId]          INT              NULL,
    [UserId]            BIGINT           NOT NULL,
    [SharedMessageId]   UNIQUEIDENTIFIER NULL,
    [ReceiverReadState] INT              DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_AppChatMessages] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AppChatMessages_TargetTenantId_TargetUserId_ReadState]
    ON [dbo].[AppChatMessages]([TargetTenantId] ASC, [TargetUserId] ASC, [ReadState] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppChatMessages_TargetTenantId_UserId_ReadState]
    ON [dbo].[AppChatMessages]([TargetTenantId] ASC, [UserId] ASC, [ReadState] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppChatMessages_TenantId_TargetUserId_ReadState]
    ON [dbo].[AppChatMessages]([TenantId] ASC, [TargetUserId] ASC, [ReadState] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppChatMessages_TenantId_UserId_ReadState]
    ON [dbo].[AppChatMessages]([TenantId] ASC, [UserId] ASC, [ReadState] ASC);

