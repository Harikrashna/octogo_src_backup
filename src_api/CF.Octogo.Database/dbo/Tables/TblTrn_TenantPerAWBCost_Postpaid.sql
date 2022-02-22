CREATE TABLE [dbo].[TblTrn_TenantPerAWBCost_Postpaid] (
    [inPerAWBCostID] INT             IDENTITY (1, 1) NOT NULL,
    [inTenantID]     INT             NOT NULL,
    [inApproachID]   INT             NOT NULL,
    [InStartSlab]    INT             CONSTRAINT [DF_TblTrn_TenantPerAWBCost_Postpaid_InStartSlab] DEFAULT ((0)) NOT NULL,
    [inEndSlab]      INT             CONSTRAINT [DF_TblTrn_TenantPerAWBCost_Postpaid_inEndSlab] DEFAULT ((0)) NOT NULL,
    [dcPerAWBCost]   DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_TenantPerAWBCost_Postpaid_dcPerAWBCost] DEFAULT ((0)) NOT NULL,
    [vcCurrency]     CHAR (3)        CONSTRAINT [DF_TblTrn_TenantPerAWBCost_Postpaid_vcCurrency] DEFAULT ('USD') NOT NULL,
    [dcAmount]       DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_TenantPerAWBCost_Postpaid_dcAmount] DEFAULT ((0)) NOT NULL,
    [btIsActive]     BIT             CONSTRAINT [DF_TblTrn_TenantPerAWBCost_Postpaid_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]    DATETIME        CONSTRAINT [DF_TblTrn_TenantPerAWBCost_Postpaid_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]    BIGINT          NOT NULL,
    [dtModifiedOn]   DATETIME        NULL,
    [inModifiedBy]   BIGINT          NULL,
    CONSTRAINT [PK_TblTrn_TenantPerAWBCost_Postpaid] PRIMARY KEY CLUSTERED ([inPerAWBCostID] ASC),
    CONSTRAINT [FK_TblTrn_TenantPerAWBCost_Postpaid_AbpTenants] FOREIGN KEY ([inTenantID]) REFERENCES [dbo].[AbpTenants] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantPerAWBCost_Postpaid_TblMst_PerAWBCostApproach] FOREIGN KEY ([inApproachID]) REFERENCES [dbo].[TblMst_PerAWBCostApproach] ([inApproachID])
);

