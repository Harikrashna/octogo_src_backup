CREATE TABLE [dbo].[TblMst_PricingApproach] (
    [inApproachID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcApproachName] VARCHAR (100) NOT NULL,
    [vcDescription]  VARCHAR (250) NULL,
    [btIsActive]     BIT           CONSTRAINT [DF_TblMst_PricingApproach_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]    DATETIME      CONSTRAINT [DF_TblMst_PricingApproach_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]    BIGINT        NOT NULL,
    [dtModifiedOn]   DATETIME      NULL,
    [inModifiedBy]   BIGINT        NULL,
    CONSTRAINT [PK_TblMst_PricingApproach] PRIMARY KEY CLUSTERED ([inApproachID] ASC)
);

