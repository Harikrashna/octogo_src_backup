CREATE TABLE [dbo].[AbpEntityPropertyChanges] (
    [Id]                   BIGINT         IDENTITY (1, 1) NOT NULL,
    [EntityChangeId]       BIGINT         NOT NULL,
    [NewValue]             NVARCHAR (512) NULL,
    [OriginalValue]        NVARCHAR (512) NULL,
    [PropertyName]         NVARCHAR (96)  NULL,
    [PropertyTypeFullName] NVARCHAR (192) NULL,
    [TenantId]             INT            NULL,
    [NewValueHash]         NVARCHAR (MAX) NULL,
    [OriginalValueHash]    NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_AbpEntityPropertyChanges] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpEntityPropertyChanges_AbpEntityChanges_EntityChangeId] FOREIGN KEY ([EntityChangeId]) REFERENCES [dbo].[AbpEntityChanges] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpEntityPropertyChanges_EntityChangeId]
    ON [dbo].[AbpEntityPropertyChanges]([EntityChangeId] ASC);

