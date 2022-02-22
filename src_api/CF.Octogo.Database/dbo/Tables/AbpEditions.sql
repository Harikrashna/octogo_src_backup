CREATE TABLE [dbo].[AbpEditions] (
    [Id]                    INT             IDENTITY (1, 1) NOT NULL,
    [CreationTime]          DATETIME2 (7)   NOT NULL,
    [CreatorUserId]         BIGINT          NULL,
    [DeleterUserId]         BIGINT          NULL,
    [DeletionTime]          DATETIME2 (7)   NULL,
    [DisplayName]           NVARCHAR (64)   NOT NULL,
    [IsDeleted]             BIT             NOT NULL,
    [LastModificationTime]  DATETIME2 (7)   NULL,
    [LastModifierUserId]    BIGINT          NULL,
    [Name]                  NVARCHAR (32)   NOT NULL,
    [Discriminator]         NVARCHAR (MAX)  DEFAULT (N'') NOT NULL,
    [AnnualPrice]           DECIMAL (18, 2) NULL,
    [ExpiringEditionId]     INT             NULL,
    [MonthlyPrice]          DECIMAL (18, 2) NULL,
    [TrialDayCount]         INT             NULL,
    [WaitingDayAfterExpire] INT             NULL,
    [DailyPrice]            DECIMAL (18, 2) NULL,
    [WeeklyPrice]           DECIMAL (18, 2) NULL,
    CONSTRAINT [PK_AbpEditions] PRIMARY KEY CLUSTERED ([Id] ASC)
);

