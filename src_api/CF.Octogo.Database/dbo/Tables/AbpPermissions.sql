CREATE TABLE [dbo].[AbpPermissions] (
    [Id]            BIGINT         IDENTITY (1, 1) NOT NULL,
    [CreationTime]  DATETIME2 (7)  NOT NULL,
    [CreatorUserId] BIGINT         NULL,
    [Discriminator] NVARCHAR (MAX) NOT NULL,
    [IsGranted]     BIT            NOT NULL,
    [Name]          NVARCHAR (128) NOT NULL,
    [TenantId]      INT            NULL,
    [RoleId]        INT            NULL,
    [UserId]        BIGINT         NULL,
    CONSTRAINT [PK_AbpPermissions] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpPermissions_AbpRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AbpRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AbpPermissions_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AbpUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpPermissions_RoleId]
    ON [dbo].[AbpPermissions]([RoleId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpPermissions_TenantId_Name]
    ON [dbo].[AbpPermissions]([TenantId] ASC, [Name] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpPermissions_UserId]
    ON [dbo].[AbpPermissions]([UserId] ASC);

