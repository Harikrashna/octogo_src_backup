CREATE TABLE [dbo].[AppInvoices] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [InvoiceDate]     DATETIME2 (7)  NOT NULL,
    [InvoiceNo]       NVARCHAR (MAX) NULL,
    [TenantAddress]   NVARCHAR (MAX) NULL,
    [TenantLegalName] NVARCHAR (MAX) NULL,
    [TenantTaxNo]     NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_AppInvoices] PRIMARY KEY CLUSTERED ([Id] ASC)
);

