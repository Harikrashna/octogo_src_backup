CREATE TABLE [dbo].[TblTrn_TenantDB] (
    [inDBID]                 BIGINT         IDENTITY (1, 1) NOT NULL,
    [inTenantID]             INT            NOT NULL,
    [inProductID]            INT            NOT NULL,
    [vcProviderName]         VARCHAR (25)   NOT NULL,
    [vcDBName]               VARCHAR (50)   NOT NULL,
    [vcConnectionStringName] VARCHAR (50)   NOT NULL,
    [vcConnectionString]     NVARCHAR (300) NOT NULL,
    [btIsDefault]            BIT            CONSTRAINT [DF_TblTrn_TenantDB_btIsDefault] DEFAULT ((0)) NOT NULL,
    [btIsActive]             BIT            CONSTRAINT [DF_TblTrn_TenantDB_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]            DATETIME       CONSTRAINT [DF_TblTrn_TenantDB_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]            BIGINT         NOT NULL,
    [dtModifiedOn]           DATETIME       NULL,
    [dtModifiedBy]           BIGINT         NULL,
    CONSTRAINT [PK_TblTrn_TenantDB] PRIMARY KEY CLUSTERED ([inDBID] ASC),
    CONSTRAINT [FK_TblTrn_TenantDB_AbpTenants] FOREIGN KEY ([inTenantID]) REFERENCES [dbo].[AbpTenants] ([Id]),
    CONSTRAINT [FK_TblTrn_TenantDB_TblMst_Product] FOREIGN KEY ([inProductID]) REFERENCES [dbo].[TblMst_Product] ([inProductID])
);

