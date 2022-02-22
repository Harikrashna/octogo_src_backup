CREATE TABLE [dbo].[AbpUserLogins] (
    [Id]            BIGINT         IDENTITY (1, 1) NOT NULL,
    [LoginProvider] NVARCHAR (128) NOT NULL,
    [ProviderKey]   NVARCHAR (256) NOT NULL,
    [TenantId]      INT            NULL,
    [UserId]        BIGINT         NOT NULL,
    CONSTRAINT [PK_AbpUserLogins] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpUserLogins_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AbpUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserLogins_TenantId_LoginProvider_ProviderKey]
    ON [dbo].[AbpUserLogins]([TenantId] ASC, [LoginProvider] ASC, [ProviderKey] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserLogins_TenantId_UserId]
    ON [dbo].[AbpUserLogins]([TenantId] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserLogins_UserId]
    ON [dbo].[AbpUserLogins]([UserId] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_AbpUserLogins_ProviderKey_TenantId]
    ON [dbo].[AbpUserLogins]([ProviderKey] ASC, [TenantId] ASC) WHERE ([TenantId] IS NOT NULL);

