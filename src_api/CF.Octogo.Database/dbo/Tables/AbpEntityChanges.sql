CREATE TABLE [dbo].[AbpEntityChanges] (
    [Id]                 BIGINT         IDENTITY (1, 1) NOT NULL,
    [ChangeTime]         DATETIME2 (7)  NOT NULL,
    [ChangeType]         TINYINT        NOT NULL,
    [EntityChangeSetId]  BIGINT         NOT NULL,
    [EntityId]           NVARCHAR (48)  NULL,
    [EntityTypeFullName] NVARCHAR (192) NULL,
    [TenantId]           INT            NULL,
    CONSTRAINT [PK_AbpEntityChanges] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpEntityChanges_AbpEntityChangeSets_EntityChangeSetId] FOREIGN KEY ([EntityChangeSetId]) REFERENCES [dbo].[AbpEntityChangeSets] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpEntityChanges_EntityChangeSetId]
    ON [dbo].[AbpEntityChanges]([EntityChangeSetId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpEntityChanges_EntityTypeFullName_EntityId]
    ON [dbo].[AbpEntityChanges]([EntityTypeFullName] ASC, [EntityId] ASC);

