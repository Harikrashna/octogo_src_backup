CREATE TABLE [dbo].[TblTrn_ProductEditionMapping] (
    [inMappingID]  INT      IDENTITY (1, 1) NOT NULL,
    [inEditionID]  INT      NOT NULL,
    [inProductID]  INT      NOT NULL,
    [btIsActive]   BIT      CONSTRAINT [DF_TblTrn_ProductEditionMapping_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]  DATETIME CONSTRAINT [DF_TblTrn_ProductEditionMapping_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]  BIGINT   NOT NULL,
    [dtModifiedOn] DATETIME NULL,
    [inModifiedBy] BIGINT   NULL,
    CONSTRAINT [PK_TblTrn_ProductEditionMapping] PRIMARY KEY CLUSTERED ([inMappingID] ASC),
    CONSTRAINT [FK_TblTrn_ProductEditionMapping_AbpEditions] FOREIGN KEY ([inEditionID]) REFERENCES [dbo].[AbpEditions] ([Id]),
    CONSTRAINT [FK_TblTrn_ProductEditionMapping_TblMst_Product] FOREIGN KEY ([inProductID]) REFERENCES [dbo].[TblMst_Product] ([inProductID])
);

