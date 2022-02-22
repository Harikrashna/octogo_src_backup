CREATE TABLE [dbo].[AbpUserRoles] (
    [Id]            BIGINT        IDENTITY (1, 1) NOT NULL,
    [CreationTime]  DATETIME2 (7) NOT NULL,
    [CreatorUserId] BIGINT        NULL,
    [RoleId]        INT           NOT NULL,
    [TenantId]      INT           NULL,
    [UserId]        BIGINT        NOT NULL,
    CONSTRAINT [PK_AbpUserRoles] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpUserRoles_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AbpUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserRoles_TenantId_RoleId]
    ON [dbo].[AbpUserRoles]([TenantId] ASC, [RoleId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserRoles_TenantId_UserId]
    ON [dbo].[AbpUserRoles]([TenantId] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserRoles_UserId]
    ON [dbo].[AbpUserRoles]([UserId] ASC);

