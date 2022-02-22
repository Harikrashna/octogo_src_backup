CREATE TABLE [dbo].[TblTrn_PerAWBCost_Postpaid] (
    [inPerAWBCostID] INT             IDENTITY (1, 1) NOT NULL,
    [inApproachID]   INT             NOT NULL,
    [InStartSlab]    INT             CONSTRAINT [DF_TblTrn_PerAWBCost_Postpaid_InStartSlab] DEFAULT ((0)) NOT NULL,
    [inEndSlab]      INT             CONSTRAINT [DF_TblTrn_PerAWBCost_Postpaid_inEndSlab] DEFAULT ((0)) NOT NULL,
    [dcPerAWBCost]   DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_PerAWBCost_Postpaid_dcPerAWBCost] DEFAULT ((0)) NOT NULL,
    [vcCurrency]     CHAR (3)        CONSTRAINT [DF_TblTrn_PerAWBCost_Postpaid_vcCurrency] DEFAULT ('USD') NOT NULL,
    [dcAmount]       DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_PerAWBCost_Postpaid_dcAmount] DEFAULT ((0)) NOT NULL,
    [btIsActive]     BIT             CONSTRAINT [DF_TblTrn_PerAWBCost_Postpaid_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]    DATETIME        CONSTRAINT [DF_TblTrn_PerAWBCost_Postpaid_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]    BIGINT          NOT NULL,
    [dtModifiedOn]   DATETIME        NULL,
    [inModifiedBy]   BIGINT          NULL,
    CONSTRAINT [PK_TblTrn_PerAWBCost_Postpaid] PRIMARY KEY CLUSTERED ([inPerAWBCostID] ASC),
    CONSTRAINT [FK_TblTrn_PerAWBCost_Postpaid_TblMst_PerAWBCostApproach] FOREIGN KEY ([inApproachID]) REFERENCES [dbo].[TblMst_PerAWBCostApproach] ([inApproachID])
);

