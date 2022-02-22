CREATE TABLE [dbo].[DBA_SQLUsers] (
    [SNo]            INT             IDENTITY (1, 1) NOT NULL,
    [UserName]       VARCHAR (100)   NULL,
    [EmailAddress]   VARCHAR (100)   NULL,
    [Password_Plain] VARCHAR (10)    NULL,
    [Password_Crypt] VARBINARY (MAX) NULL,
    [IsProcessed]    BIT             DEFAULT ((0)) NULL,
    [IsActive]       BIT             DEFAULT ((1)) NULL
);

