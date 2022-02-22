CREATE TABLE [dbo].[AbpDynamicEntityPropertyValues] (
    [Value]                   NVARCHAR (MAX) NOT NULL,
    [EntityId]                NVARCHAR (MAX) NULL,
    [DynamicEntityPropertyId] INT            NOT NULL,
    [TenantId]                INT            NULL,
    [Id]                      BIGINT         IDENTITY (1, 1) NOT NULL,
    CONSTRAINT [PK_AbpDynamicEntityPropertyValues] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpDynamicEntityPropertyValues_AbpDynamicEntityProperties_DynamicEntityPropertyId] FOREIGN KEY ([DynamicEntityPropertyId]) REFERENCES [dbo].[AbpDynamicEntityProperties] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpDynamicEntityPropertyValues_DynamicEntityPropertyId]
    ON [dbo].[AbpDynamicEntityPropertyValues]([DynamicEntityPropertyId] ASC);

