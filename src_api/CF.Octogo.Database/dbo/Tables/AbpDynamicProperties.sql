CREATE TABLE [dbo].[AbpDynamicProperties] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [PropertyName] NVARCHAR (256) NULL,
    [InputType]    NVARCHAR (MAX) NULL,
    [Permission]   NVARCHAR (MAX) NULL,
    [TenantId]     INT            NULL,
    [DisplayName]  NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_AbpDynamicProperties] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_AbpDynamicProperties_PropertyName_TenantId]
    ON [dbo].[AbpDynamicProperties]([PropertyName] ASC, [TenantId] ASC) WHERE ([PropertyName] IS NOT NULL AND [TenantId] IS NOT NULL);

