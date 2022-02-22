CREATE TABLE [dbo].[Demo] (
    [Id]                   INT            IDENTITY (1, 1) NOT NULL,
    [Name]                 NVARCHAR (200) NOT NULL,
    [CreationTime]         DATETIME2 (7)  NOT NULL,
    [CreatorUserId]        BIGINT         NULL,
    [LastModificationTime] DATETIME2 (7)  NULL,
    [LastModifierUserId]   BIGINT         NULL,
    [IsDeleted]            BIT            NOT NULL,
    [DeleterUserId]        BIGINT         NULL,
    [DeletionTime]         DATETIME2 (7)  NULL,
    CONSTRAINT [PK_Demo] PRIMARY KEY CLUSTERED ([Id] ASC)
);

