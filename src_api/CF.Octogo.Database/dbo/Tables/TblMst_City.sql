CREATE TABLE [dbo].[TblMst_City] (
    [SNo]                        INT             IDENTITY (1, 1) NOT NULL,
    [ZoneSNo]                    INT             NULL,
    [ZoneName]                   VARCHAR (50)    NULL,
    [CityCode]                   CHAR (3)        NOT NULL,
    [CityName]                   NVARCHAR (100)  NOT NULL,
    [CountrySNo]                 INT             NOT NULL,
    [CountryCode]                CHAR (2)        NOT NULL,
    [CountryName]                VARCHAR (100)   NOT NULL,
    [DaylightSaving]             NCHAR (10)      NULL,
    [TimeDifference]             INT             NULL,
    [TimeZoneSNo]                INT             NULL,
    [IsDayLightSaving]           BIT             NULL,
    [IATAArea]                   TINYINT         NULL,
    [IsActive]                   BIT             NOT NULL,
    [CreatedOn]                  DATETIME        NOT NULL,
    [CreatedBy]                  INT             NOT NULL,
    [UpdatedOn]                  DATETIME        NULL,
    [UpdatedBy]                  INT             NULL,
    [CurrentTime]                VARCHAR (20)    NULL,
    [TimeZoneMasterSno]          INT             NULL,
    [PriorApproval]              BIT             NULL,
    [SHCSNo]                     NVARCHAR (MAX)  NULL,
    [DGClassSNo]                 NVARCHAR (MAX)  NULL,
    [VolumeConversionInch]       DECIMAL (8, 3)  NULL,
    [VolumeConversionCM]         DECIMAL (18, 3) NULL,
    [DomesticBookingPeriod]      INT             NULL,
    [InternationalBookingPeriod] INT             NULL,
    [IsHouse]                    BIT             NULL,
    [EventType]                  TINYINT         NULL,
    [IsCraMasterTransfer]        TINYINT         NULL,
    [IsDimensioMandatoryAtCity]  BIT             CONSTRAINT [DF_TblMst_City_IsDimensioMandatoryAtCity] DEFAULT ((1)) NULL,
    [StateSNo]                   INT             NULL,
    [IsSync]                     BIT             NULL,
    [LastChangeDateTime]         DATETIME        NULL,
    [StateCode]                  NVARCHAR (30)   NULL,
    [StateName]                  VARCHAR (100)   NULL,
    CONSTRAINT [PK_TblMst_City] PRIMARY KEY CLUSTERED ([SNo] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'1-IATAArea1,2-IATAArea2,3-IATAArea3', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'TblMst_City', @level2type = N'COLUMN', @level2name = N'IATAArea';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'1-Active,0-InActive', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'TblMst_City', @level2type = N'COLUMN', @level2name = N'IsActive';

