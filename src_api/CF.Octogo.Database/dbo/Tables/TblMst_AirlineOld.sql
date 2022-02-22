CREATE TABLE [dbo].[TblMst_AirlineOld] (
    [inAirlineID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcAirlineName] VARCHAR (100) NOT NULL,
    [vcDescription] VARCHAR (200) NULL,
    [btIsActive]    BIT           NOT NULL,
    [dtCreatedOn]   DATETIME      NOT NULL,
    [inCreatedBy]   BIGINT        NOT NULL,
    [dtModifiedOn]  DATETIME      NULL,
    [inModifiedBy]  BIGINT        NULL,
    CONSTRAINT [PK_TblMst_AirlineOld] PRIMARY KEY CLUSTERED ([inAirlineID] ASC)
);

