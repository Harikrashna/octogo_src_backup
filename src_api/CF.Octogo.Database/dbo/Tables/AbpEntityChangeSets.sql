CREATE TABLE [dbo].[AbpEntityChangeSets] (
    [Id]                   BIGINT         IDENTITY (1, 1) NOT NULL,
    [BrowserInfo]          NVARCHAR (512) NULL,
    [ClientIpAddress]      NVARCHAR (64)  NULL,
    [ClientName]           NVARCHAR (128) NULL,
    [CreationTime]         DATETIME2 (7)  NOT NULL,
    [ExtensionData]        NVARCHAR (MAX) NULL,
    [ImpersonatorTenantId] INT            NULL,
    [ImpersonatorUserId]   BIGINT         NULL,
    [Reason]               NVARCHAR (256) NULL,
    [TenantId]             INT            NULL,
    [UserId]               BIGINT         NULL,
    CONSTRAINT [PK_AbpEntityChangeSets] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpEntityChangeSets_TenantId_CreationTime]
    ON [dbo].[AbpEntityChangeSets]([TenantId] ASC, [CreationTime] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpEntityChangeSets_TenantId_Reason]
    ON [dbo].[AbpEntityChangeSets]([TenantId] ASC, [Reason] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpEntityChangeSets_TenantId_UserId]
    ON [dbo].[AbpEntityChangeSets]([TenantId] ASC, [UserId] ASC);

