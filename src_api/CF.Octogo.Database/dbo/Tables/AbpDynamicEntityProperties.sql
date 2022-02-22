CREATE TABLE [dbo].[AbpDynamicEntityProperties] (
    [Id]                INT            IDENTITY (1, 1) NOT NULL,
    [EntityFullName]    NVARCHAR (256) NULL,
    [DynamicPropertyId] INT            NOT NULL,
    [TenantId]          INT            NULL,
    CONSTRAINT [PK_AbpDynamicEntityProperties] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpDynamicEntityProperties_AbpDynamicProperties_DynamicPropertyId] FOREIGN KEY ([DynamicPropertyId]) REFERENCES [dbo].[AbpDynamicProperties] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpDynamicEntityProperties_DynamicPropertyId]
    ON [dbo].[AbpDynamicEntityProperties]([DynamicPropertyId] ASC);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_AbpDynamicEntityProperties_EntityFullName_DynamicPropertyId_TenantId]
    ON [dbo].[AbpDynamicEntityProperties]([EntityFullName] ASC, [DynamicPropertyId] ASC, [TenantId] ASC) WHERE ([EntityFullName] IS NOT NULL AND [TenantId] IS NOT NULL);

