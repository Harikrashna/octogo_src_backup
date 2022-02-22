CREATE TABLE [dbo].[AppFriendships] (
    [Id]                     BIGINT           IDENTITY (1, 1) NOT NULL,
    [CreationTime]           DATETIME2 (7)    NOT NULL,
    [FriendProfilePictureId] UNIQUEIDENTIFIER NULL,
    [FriendTenancyName]      NVARCHAR (MAX)   NULL,
    [FriendTenantId]         INT              NULL,
    [FriendUserId]           BIGINT           NOT NULL,
    [FriendUserName]         NVARCHAR (256)   NOT NULL,
    [State]                  INT              NOT NULL,
    [TenantId]               INT              NULL,
    [UserId]                 BIGINT           NOT NULL,
    CONSTRAINT [PK_AppFriendships] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AppFriendships_FriendTenantId_FriendUserId]
    ON [dbo].[AppFriendships]([FriendTenantId] ASC, [FriendUserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppFriendships_FriendTenantId_UserId]
    ON [dbo].[AppFriendships]([FriendTenantId] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppFriendships_TenantId_FriendUserId]
    ON [dbo].[AppFriendships]([TenantId] ASC, [FriendUserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppFriendships_TenantId_UserId]
    ON [dbo].[AppFriendships]([TenantId] ASC, [UserId] ASC);

