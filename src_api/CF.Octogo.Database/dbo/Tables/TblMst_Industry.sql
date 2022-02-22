CREATE TABLE [dbo].[TblMst_Industry] (
    [inIndustryID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcIndustryName] VARCHAR (100) NOT NULL,
    [vcDescription]  VARCHAR (250) NULL,
    [btIsActive]     BIT           NOT NULL,
    [dtCreatedon]    DATETIME      NOT NULL,
    [inCreatedBy]    BIGINT        NOT NULL,
    [dtModifiedOn]   DATETIME      NULL,
    [inModifiedBy]   BIGINT        NULL,
    CONSTRAINT [PK_TblMst_Industry] PRIMARY KEY CLUSTERED ([inIndustryID] ASC)
);

