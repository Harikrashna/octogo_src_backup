CREATE TABLE [dbo].[AbpDynamicPropertyValues] (
    [Value]             NVARCHAR (MAX) NOT NULL,
    [TenantId]          INT            NULL,
    [DynamicPropertyId] INT            NOT NULL,
    [Id]                BIGINT         IDENTITY (1, 1) NOT NULL,
    CONSTRAINT [PK_AbpDynamicPropertyValues] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpDynamicPropertyValues_AbpDynamicProperties_DynamicPropertyId] FOREIGN KEY ([DynamicPropertyId]) REFERENCES [dbo].[AbpDynamicProperties] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpDynamicPropertyValues_DynamicPropertyId]
    ON [dbo].[AbpDynamicPropertyValues]([DynamicPropertyId] ASC);

