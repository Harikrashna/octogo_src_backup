CREATE TABLE [dbo].[TblTrn_ApproachAddOnMapping] (
    [inMappingID]  INT      IDENTITY (1, 1) NOT NULL,
    [inAddOnID]    INT      NOT NULL,
    [inApproachID] INT      NOT NULL,
    [btIsActive]   BIT      CONSTRAINT [DF_TblTrn_ApproachAddOnMapping_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]  DATETIME CONSTRAINT [DF_TblTrn_ApproachAddOnMapping_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]  BIGINT   NOT NULL,
    [dtModifiedOn] DATETIME NULL,
    [inModifiedBy] BIGINT   NULL,
    CONSTRAINT [PK_TblTrn_ApproachAddOnMapping] PRIMARY KEY CLUSTERED ([inMappingID] ASC),
    CONSTRAINT [FK_TblTrn_ApproachAddOnMapping_TblMst_PricingApproach] FOREIGN KEY ([inApproachID]) REFERENCES [dbo].[TblMst_PricingApproach] ([inApproachID]),
    CONSTRAINT [FK_TblTrn_ApproachAddOnMapping_TblTrn_AddOn] FOREIGN KEY ([inAddOnID]) REFERENCES [dbo].[TblTrn_AddOn] ([inAddOnID])
);

