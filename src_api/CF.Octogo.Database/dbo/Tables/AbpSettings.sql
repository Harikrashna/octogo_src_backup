CREATE TABLE [dbo].[AbpSettings] (
    [Id]                   BIGINT         IDENTITY (1, 1) NOT NULL,
    [CreationTime]         DATETIME2 (7)  NOT NULL,
    [CreatorUserId]        BIGINT         NULL,
    [LastModificationTime] DATETIME2 (7)  NULL,
    [LastModifierUserId]   BIGINT         NULL,
    [Name]                 NVARCHAR (256) NOT NULL,
    [TenantId]             INT            NULL,
    [UserId]               BIGINT         NULL,
    [Value]                NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_AbpSettings] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpSettings_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AbpUsers] ([Id])
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_AbpSettings_TenantId_Name_UserId]
    ON [dbo].[AbpSettings]([TenantId] ASC, [Name] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpSettings_UserId]
    ON [dbo].[AbpSettings]([UserId] ASC);

