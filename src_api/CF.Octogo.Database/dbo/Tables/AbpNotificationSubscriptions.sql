CREATE TABLE [dbo].[AbpNotificationSubscriptions] (
    [Id]                              UNIQUEIDENTIFIER NOT NULL,
    [CreationTime]                    DATETIME2 (7)    NOT NULL,
    [CreatorUserId]                   BIGINT           NULL,
    [EntityId]                        NVARCHAR (96)    NULL,
    [EntityTypeAssemblyQualifiedName] NVARCHAR (512)   NULL,
    [EntityTypeName]                  NVARCHAR (250)   NULL,
    [NotificationName]                NVARCHAR (96)    NULL,
    [TenantId]                        INT              NULL,
    [UserId]                          BIGINT           NOT NULL,
    CONSTRAINT [PK_AbpNotificationSubscriptions] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpNotificationSubscriptions_NotificationName_EntityTypeName_EntityId_UserId]
    ON [dbo].[AbpNotificationSubscriptions]([NotificationName] ASC, [EntityTypeName] ASC, [EntityId] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpNotificationSubscriptions_TenantId_NotificationName_EntityTypeName_EntityId_UserId]
    ON [dbo].[AbpNotificationSubscriptions]([TenantId] ASC, [NotificationName] ASC, [EntityTypeName] ASC, [EntityId] ASC, [UserId] ASC);

