CREATE TABLE [dbo].[TblTrn_TenantEditionAddOnMapping] (
    [inMappingID]     INT      IDENTITY (1, 1) NOT NULL,
    [inTenantID]      INT      NOT NULL,
    [inEditionID]     INT      NOT NULL,
    [inAddOnID]       INT      NULL,
    [inPricingTypeID] INT      NULL,
    [dtStartDate]     DATETIME CONSTRAINT [DF_TblTrn_TenantEditionAddOnMapping_dtStartDate] DEFAULT (getdate()) NOT NULL,
    [dtEndDate]       DATETIME NULL,
    [btIsActive]      BIT      CONSTRAINT [DF_TblTrn_TenantEditionAddOnMapping_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]     DATETIME CONSTRAINT [DF_TblTrn_TenantEditionAddOnMapping_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]     BIGINT   NOT NULL,
    [dtModifiedOn]    DATETIME NULL,
    [inModifiedBy]    BIGINT   NULL,
    CONSTRAINT [PK_TblTrn_TenantEditionAddOnMapping] PRIMARY KEY CLUSTERED ([inMappingID] ASC),
    CONSTRAINT [FK_TblTrn_TenantEditionAddOnMapping_AbpEditions] FOREIGN KEY ([inEditionID]) REFERENCES [dbo].[AbpEditions] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantEditionAddOnMapping_AbpTenants] FOREIGN KEY ([inTenantID]) REFERENCES [dbo].[AbpTenants] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantEditionAddOnMapping_TblMst_PricingType] FOREIGN KEY ([inPricingTypeID]) REFERENCES [dbo].[TblMst_PricingType] ([inPricingTypeID])
);

