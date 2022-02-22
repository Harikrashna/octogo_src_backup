CREATE TABLE [dbo].[TblTrn_TenantAddOnPricing_Prepaid] (
    [inTenantAddOnPricingID] INT             IDENTITY (1, 1) NOT NULL,
    [inTenantID]             INT             NOT NULL,
    [inAddOnID]              INT             NOT NULL,
    [inPricingTypeID]        INT             NOT NULL,
    [dcAmount]               DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_TenantAddOnPricing_Prepaid_dcAmount] DEFAULT ((0)) NOT NULL,
    [dcDiscountPercentage]   DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_TenantAddOnPricing_Prepaid_dcDiscountPercentage] DEFAULT ((0)) NOT NULL,
    [btIsActive]             BIT             CONSTRAINT [DF_TblTrn_TenantAddOnPricing_Prepaid_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]            DATETIME        CONSTRAINT [DF_TblTrn_TenantAddOnPricing_Prepaid_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]            BIGINT          NOT NULL,
    [dtModifiedOn]           DATETIME        NULL,
    [inModifiedBy]           BIGINT          NULL,
    CONSTRAINT [PK_TblTrn_TenantAddOnPricing_Prepaid] PRIMARY KEY CLUSTERED ([inTenantAddOnPricingID] ASC),
    CONSTRAINT [FK_TblTrn_TenantAddOnPricing_Prepaid_AbpTenants] FOREIGN KEY ([inTenantID]) REFERENCES [dbo].[AbpTenants] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantAddOnPricing_Prepaid_TblMst_PricingType] FOREIGN KEY ([inPricingTypeID]) REFERENCES [dbo].[TblMst_PricingType] ([inPricingTypeID]),
    CONSTRAINT [FK_TblTrn_TenantAddOnPricing_Prepaid_TblTrn_AddOn] FOREIGN KEY ([inAddOnID]) REFERENCES [dbo].[TblTrn_AddOn] ([inAddOnID])
);

