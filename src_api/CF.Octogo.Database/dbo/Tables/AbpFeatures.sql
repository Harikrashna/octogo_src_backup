CREATE TABLE [dbo].[AbpFeatures] (
    [Id]            BIGINT          IDENTITY (1, 1) NOT NULL,
    [CreationTime]  DATETIME2 (7)   NOT NULL,
    [CreatorUserId] BIGINT          NULL,
    [Discriminator] NVARCHAR (MAX)  NOT NULL,
    [Name]          NVARCHAR (128)  NOT NULL,
    [Value]         NVARCHAR (2000) NOT NULL,
    [EditionId]     INT             NULL,
    [TenantId]      INT             NULL,
    CONSTRAINT [PK_AbpFeatures] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpFeatures_AbpEditions_EditionId] FOREIGN KEY ([EditionId]) REFERENCES [dbo].[AbpEditions] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpFeatures_EditionId_Name]
    ON [dbo].[AbpFeatures]([EditionId] ASC, [Name] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpFeatures_TenantId_Name]
    ON [dbo].[AbpFeatures]([TenantId] ASC, [Name] ASC);

