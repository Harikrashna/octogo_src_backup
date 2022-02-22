CREATE TABLE [dbo].[TblMst_PerAWBCostApproach] (
    [inApproachID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcApproachName] VARCHAR (100) NOT NULL,
    [vcDescription]  VARCHAR (250) NULL,
    [btIsActive]     BIT           CONSTRAINT [DF_TblMst_PerAWBCostApproach_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]    DATETIME      CONSTRAINT [DF_TblMst_PerAWBCostApproach_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]    BIGINT        NOT NULL,
    [dtModifiedOn]   DATETIME      NULL,
    [inModifiedBy]   BIGINT        NULL,
    CONSTRAINT [PK_TblMst_PerAWBCostApproach] PRIMARY KEY CLUSTERED ([inApproachID] ASC)
);

