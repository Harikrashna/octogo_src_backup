CREATE TABLE [dbo].[TblTrn_TenantAddOnApproachMapping] (
    [inMappingID]  INT      IDENTITY (1, 1) NOT NULL,
    [inTenantID]   INT      NOT NULL,
    [inAddOnID]    INT      NOT NULL,
    [inApproachID] INT      NOT NULL,
    [btIsActive]   BIT      CONSTRAINT [DF_TblTrn_TenantAddOnApproachMapping_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]  DATETIME CONSTRAINT [DF_TblTrn_TenantAddOnApproachMapping_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]  BIGINT   NOT NULL,
    [dtModifiedOn] DATETIME NULL,
    [inModifiedBy] BIGINT   NULL,
    CONSTRAINT [PK_TblTrn_TenantAddOnApproachMapping] PRIMARY KEY CLUSTERED ([inMappingID] ASC),
    CONSTRAINT [FK_TblTrn_TenantAddOnApproachMapping_AbpTenants] FOREIGN KEY ([inTenantID]) REFERENCES [dbo].[AbpTenants] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantAddOnApproachMapping_TblMst_PricingApproach] FOREIGN KEY ([inApproachID]) REFERENCES [dbo].[TblMst_PricingApproach] ([inApproachID]),
    CONSTRAINT [FK_TblTrn_TenantAddOnApproachMapping_TblTrn_AddOn] FOREIGN KEY ([inAddOnID]) REFERENCES [dbo].[TblTrn_AddOn] ([inAddOnID])
);

