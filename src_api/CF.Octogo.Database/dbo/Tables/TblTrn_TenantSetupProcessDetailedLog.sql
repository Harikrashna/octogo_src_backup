CREATE TABLE [dbo].[TblTrn_TenantSetupProcessDetailedLog] (
    [inSetupDetailLogID] BIGINT         IDENTITY (1, 1) NOT NULL,
    [inSetupID]          BIGINT         NULL,
    [vcLogMessage]       NVARCHAR (MAX) NULL,
    [dtCreatedOn]        DATETIME       NULL,
    [inCreatedBy]        BIGINT         NULL,
    CONSTRAINT [PK_TblTrn_TenantSetupProcessDetailedLog] PRIMARY KEY CLUSTERED ([inSetupDetailLogID] ASC)
);

