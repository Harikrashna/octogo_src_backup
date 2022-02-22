CREATE TABLE [dbo].[TblMst_Designation] (
    [inDesignationID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcDesignationName] VARCHAR (100) NOT NULL,
    [vcDescription]     VARCHAR (250) NULL,
    [btIsActive]        BIT           NOT NULL,
    [dtCreatedOn]       DATETIME      NOT NULL,
    [inCreatedBy]       BIGINT        NOT NULL,
    [dtModifiedOn]      DATETIME      NULL,
    [inModifiedBy]      BIGINT        NULL
);

