CREATE TABLE [dbo].[AbpBackgroundJobs] (
    [Id]            BIGINT         IDENTITY (1, 1) NOT NULL,
    [CreationTime]  DATETIME2 (7)  NOT NULL,
    [CreatorUserId] BIGINT         NULL,
    [IsAbandoned]   BIT            NOT NULL,
    [JobArgs]       NVARCHAR (MAX) NOT NULL,
    [JobType]       NVARCHAR (512) NOT NULL,
    [LastTryTime]   DATETIME2 (7)  NULL,
    [NextTryTime]   DATETIME2 (7)  NOT NULL,
    [Priority]      TINYINT        NOT NULL,
    [TryCount]      SMALLINT       NOT NULL,
    CONSTRAINT [PK_AbpBackgroundJobs] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpBackgroundJobs_IsAbandoned_NextTryTime]
    ON [dbo].[AbpBackgroundJobs]([IsAbandoned] ASC, [NextTryTime] ASC);

