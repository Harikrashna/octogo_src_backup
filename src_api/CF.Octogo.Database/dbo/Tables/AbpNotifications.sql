CREATE TABLE [dbo].[AbpNotifications] (
    [Id]                              UNIQUEIDENTIFIER NOT NULL,
    [CreationTime]                    DATETIME2 (7)    NOT NULL,
    [CreatorUserId]                   BIGINT           NULL,
    [Data]                            NVARCHAR (MAX)   NULL,
    [DataTypeName]                    NVARCHAR (512)   NULL,
    [EntityId]                        NVARCHAR (96)    NULL,
    [EntityTypeAssemblyQualifiedName] NVARCHAR (512)   NULL,
    [EntityTypeName]                  NVARCHAR (250)   NULL,
    [ExcludedUserIds]                 NVARCHAR (MAX)   NULL,
    [NotificationName]                NVARCHAR (96)    NOT NULL,
    [Severity]                        TINYINT          NOT NULL,
    [TenantIds]                       NVARCHAR (MAX)   NULL,
    [UserIds]                         NVARCHAR (MAX)   NULL,
    CONSTRAINT [PK_AbpNotifications] PRIMARY KEY CLUSTERED ([Id] ASC)
);

