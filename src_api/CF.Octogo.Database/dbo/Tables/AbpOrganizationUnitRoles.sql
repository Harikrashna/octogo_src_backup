CREATE TABLE [dbo].[AbpOrganizationUnitRoles] (
    [Id]                 BIGINT        IDENTITY (1, 1) NOT NULL,
    [CreationTime]       DATETIME2 (7) NOT NULL,
    [CreatorUserId]      BIGINT        NULL,
    [TenantId]           INT           NULL,
    [RoleId]             INT           NOT NULL,
    [OrganizationUnitId] BIGINT        NOT NULL,
    [IsDeleted]          BIT           NOT NULL,
    CONSTRAINT [PK_AbpOrganizationUnitRoles] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpOrganizationUnitRoles_TenantId_OrganizationUnitId]
    ON [dbo].[AbpOrganizationUnitRoles]([TenantId] ASC, [OrganizationUnitId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpOrganizationUnitRoles_TenantId_RoleId]
    ON [dbo].[AbpOrganizationUnitRoles]([TenantId] ASC, [RoleId] ASC);

