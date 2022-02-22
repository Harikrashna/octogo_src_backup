CREATE TABLE [dbo].[AbpUserAccounts] (
    [Id]                   BIGINT         IDENTITY (1, 1) NOT NULL,
    [CreationTime]         DATETIME2 (7)  NOT NULL,
    [CreatorUserId]        BIGINT         NULL,
    [DeleterUserId]        BIGINT         NULL,
    [DeletionTime]         DATETIME2 (7)  NULL,
    [EmailAddress]         NVARCHAR (256) NULL,
    [IsDeleted]            BIT            NOT NULL,
    [LastModificationTime] DATETIME2 (7)  NULL,
    [LastModifierUserId]   BIGINT         NULL,
    [TenantId]             INT            NULL,
    [UserId]               BIGINT         NOT NULL,
    [UserLinkId]           BIGINT         NULL,
    [UserName]             NVARCHAR (256) NULL,
    CONSTRAINT [PK_AbpUserAccounts] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserAccounts_EmailAddress]
    ON [dbo].[AbpUserAccounts]([EmailAddress] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserAccounts_TenantId_EmailAddress]
    ON [dbo].[AbpUserAccounts]([TenantId] ASC, [EmailAddress] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserAccounts_TenantId_UserId]
    ON [dbo].[AbpUserAccounts]([TenantId] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserAccounts_TenantId_UserName]
    ON [dbo].[AbpUserAccounts]([TenantId] ASC, [UserName] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserAccounts_UserName]
    ON [dbo].[AbpUserAccounts]([UserName] ASC);

