CREATE TABLE [dbo].[AbpRoleClaims] (
    [Id]            BIGINT         IDENTITY (1, 1) NOT NULL,
    [ClaimType]     NVARCHAR (256) NULL,
    [ClaimValue]    NVARCHAR (MAX) NULL,
    [CreationTime]  DATETIME2 (7)  NOT NULL,
    [CreatorUserId] BIGINT         NULL,
    [RoleId]        INT            NOT NULL,
    [TenantId]      INT            NULL,
    CONSTRAINT [PK_AbpRoleClaims] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpRoleClaims_AbpRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AbpRoles] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpRoleClaims_RoleId]
    ON [dbo].[AbpRoleClaims]([RoleId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpRoleClaims_TenantId_ClaimType]
    ON [dbo].[AbpRoleClaims]([TenantId] ASC, [ClaimType] ASC);

