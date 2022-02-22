CREATE TABLE [dbo].[TblTrn_TenantEditionPricing_Prepaid] (
    [inTenantEditionPricingID] INT             IDENTITY (1, 1) NOT NULL,
    [inTenantID]               INT             NOT NULL,
    [inEditionID]              INT             NOT NULL,
    [inPricingTypeID]          INT             NOT NULL,
    [dcAmount]                 DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_TenantEditionPricing_Prepaid_dcAmount] DEFAULT ((0)) NOT NULL,
    [dcDiscountPercentage]     DECIMAL (18, 2) CONSTRAINT [DF_TblTrn_TenantEditionPricing_Prepaid_dcDiscountPercentage] DEFAULT ((0)) NOT NULL,
    [btIsActive]               BIT             CONSTRAINT [DF_TblTrn_TenantEditionPricing_Prepaid_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]              DATETIME        CONSTRAINT [DF_TblTrn_TenantEditionPricing_Prepaid_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]              BIGINT          NOT NULL,
    [dtModifiedOn]             DATETIME        NULL,
    [inModifiedBy]             BIGINT          NULL,
    CONSTRAINT [PK_TblTrn_TenantEditionPricing_Prepaid] PRIMARY KEY CLUSTERED ([inTenantEditionPricingID] ASC),
    CONSTRAINT [FK_TblTrn_TenantEditionPricing_Prepaid_AbpEditions] FOREIGN KEY ([inEditionID]) REFERENCES [dbo].[AbpEditions] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantEditionPricing_Prepaid_AbpTenants] FOREIGN KEY ([inTenantID]) REFERENCES [dbo].[AbpTenants] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantEditionPricing_Prepaid_TblMst_PricingType] FOREIGN KEY ([inPricingTypeID]) REFERENCES [dbo].[TblMst_PricingType] ([inPricingTypeID])
);

