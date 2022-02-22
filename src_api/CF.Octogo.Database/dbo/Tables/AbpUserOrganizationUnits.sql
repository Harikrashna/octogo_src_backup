CREATE TABLE [dbo].[AbpUserOrganizationUnits] (
    [Id]                 BIGINT        IDENTITY (1, 1) NOT NULL,
    [CreationTime]       DATETIME2 (7) NOT NULL,
    [CreatorUserId]      BIGINT        NULL,
    [OrganizationUnitId] BIGINT        NOT NULL,
    [TenantId]           INT           NULL,
    [UserId]             BIGINT        NOT NULL,
    [IsDeleted]          BIT           DEFAULT (CONVERT([bit],(0))) NOT NULL,
    CONSTRAINT [PK_AbpUserOrganizationUnits] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpUserOrganizationUnits_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AbpUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserOrganizationUnits_TenantId_OrganizationUnitId]
    ON [dbo].[AbpUserOrganizationUnits]([TenantId] ASC, [OrganizationUnitId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserOrganizationUnits_TenantId_UserId]
    ON [dbo].[AbpUserOrganizationUnits]([TenantId] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserOrganizationUnits_UserId]
    ON [dbo].[AbpUserOrganizationUnits]([UserId] ASC);

