CREATE TABLE [dbo].[AppUserDelegations] (
    [Id]                   BIGINT        IDENTITY (1, 1) NOT NULL,
    [CreationTime]         DATETIME2 (7) NOT NULL,
    [CreatorUserId]        BIGINT        NULL,
    [LastModificationTime] DATETIME2 (7) NULL,
    [LastModifierUserId]   BIGINT        NULL,
    [IsDeleted]            BIT           NOT NULL,
    [DeleterUserId]        BIGINT        NULL,
    [DeletionTime]         DATETIME2 (7) NULL,
    [SourceUserId]         BIGINT        NOT NULL,
    [TargetUserId]         BIGINT        NOT NULL,
    [TenantId]             INT           NULL,
    [StartTime]            DATETIME2 (7) NOT NULL,
    [EndTime]              DATETIME2 (7) NOT NULL,
    CONSTRAINT [PK_AppUserDelegations] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AppUserDelegations_TenantId_SourceUserId]
    ON [dbo].[AppUserDelegations]([TenantId] ASC, [SourceUserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AppUserDelegations_TenantId_TargetUserId]
    ON [dbo].[AppUserDelegations]([TenantId] ASC, [TargetUserId] ASC);

