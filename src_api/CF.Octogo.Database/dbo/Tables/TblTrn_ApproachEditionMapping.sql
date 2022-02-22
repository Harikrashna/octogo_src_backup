CREATE TABLE [dbo].[TblTrn_ApproachEditionMapping] (
    [inMappingID]  INT      IDENTITY (1, 1) NOT NULL,
    [inEditionID]  INT      NOT NULL,
    [inApproachID] INT      NOT NULL,
    [btIsActive]   BIT      CONSTRAINT [DF_TblTrn_ApproachEditionMapping_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]  DATETIME CONSTRAINT [DF_TblTrn_ApproachEditionMapping_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]  BIGINT   NOT NULL,
    [dtModifiedOn] DATETIME NULL,
    [inModifiedBy] BIGINT   NULL,
    CONSTRAINT [PK_TblTrn_ApproachEditionMapping] PRIMARY KEY CLUSTERED ([inMappingID] ASC),
    CONSTRAINT [FK_TblTrn_ApproachEditionMapping_AbpEditions] FOREIGN KEY ([inEditionID]) REFERENCES [dbo].[AbpEditions] ([Id]),
    CONSTRAINT [FK_TblTrn_ApproachEditionMapping_TblMst_PricingApproach] FOREIGN KEY ([inApproachID]) REFERENCES [dbo].[TblMst_PricingApproach] ([inApproachID])
);

