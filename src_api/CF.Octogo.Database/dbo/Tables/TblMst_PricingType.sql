CREATE TABLE [dbo].[TblMst_PricingType] (
    [inPricingTypeID] INT          IDENTITY (1, 1) NOT NULL,
    [vcTypeName]      VARCHAR (50) NOT NULL,
    [inNoOfDays]      INT          NOT NULL,
    [btIsActive]      BIT          CONSTRAINT [DF_TblMst_PricingType_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]     DATETIME     CONSTRAINT [DF_TblMst_PricingType_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]     BIGINT       NOT NULL,
    [dtModifiedOn]    DATETIME     NULL,
    [inModifiedBy]    BIGINT       NULL,
    CONSTRAINT [PK_TblMst_PricingType] PRIMARY KEY CLUSTERED ([inPricingTypeID] ASC)
);

