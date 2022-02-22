CREATE TABLE [dbo].[AbpPersistedGrants] (
    [Id]           NVARCHAR (200) NOT NULL,
    [ClientId]     NVARCHAR (200) NOT NULL,
    [CreationTime] DATETIME2 (7)  NOT NULL,
    [Data]         NVARCHAR (MAX) NOT NULL,
    [Expiration]   DATETIME2 (7)  NULL,
    [SubjectId]    NVARCHAR (200) NULL,
    [Type]         NVARCHAR (50)  NOT NULL,
    [ConsumedTime] DATETIME2 (7)  NULL,
    [Description]  NVARCHAR (200) NULL,
    [SessionId]    NVARCHAR (100) NULL,
    CONSTRAINT [PK_AbpPersistedGrants] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpPersistedGrants_Expiration]
    ON [dbo].[AbpPersistedGrants]([Expiration] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpPersistedGrants_SubjectId_ClientId_Type]
    ON [dbo].[AbpPersistedGrants]([SubjectId] ASC, [ClientId] ASC, [Type] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpPersistedGrants_SubjectId_SessionId_Type]
    ON [dbo].[AbpPersistedGrants]([SubjectId] ASC, [SessionId] ASC, [Type] ASC);

