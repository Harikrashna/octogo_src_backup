/*
    CREATED ON : 09 Nov 2021
    DESC : 
    DRY RUN : 
    EXEC USP_GetMasterDataByMasterName_Test 'PRICINGTYPE,CURRENCY,PRICINGAPPROACH,AWBCOSTAPPROACH'
*/

    CREATE PROCEDURE USP_GetMasterDataByMasterName_Test
    (
        @MasterName VARCHAR(50) = NULL
    )
    AS  
        BEGIN
            SET NOCOUNT ON;
            DECLARE @Sql VARCHAR(MAX) = 'SELECT NULL MasterName, NULL MasterData ';
            DECLARE @Masters Table(Sno INT, Name VARCHAR(50));
            SET @MasterName = UPPER(LTRIM(RTRIM(@MasterName)))
            IF(ISNULL(@MasterName,'')='')
                BEGIN
                    -- Add Master name
                    INSERT INTO @Masters(Sno, Name)
                    VALUES(1, 'PRICINGTYPE'),(2, 'PRICINGAPPROACH'),(3, 'AWBCOSTAPPROACH'),(4, 'PRODUCT'),(5, 'SERVICE')
                        ,(6, 'USERTYPE'),(7, 'DEPARTMENT'),(8, 'AIRLINE'),(9, 'INDUSTRY'),(10, 'DESIGNATION')
                        ,(11, 'CITY'),(12, 'COUNTRY'),(13, 'CURRENCY'),(14, 'STATE'),(15, 'CONTINENT'),(16, 'IATACODE')
                        ,(17, 'CLASSIFICATION'),(18, 'TIMEZONE'),(19, 'ZONE'),(20, 'SHC'),(21, 'DGCLASS')
                END
            ELSE
                BEGIN
                    INSERT INTO @Masters(Sno, Name)
                    SELECT ROW_NUMBER() OVER (ORDER BY tuple) row_num, tuple 
                        FROM split_string(@MasterName, ',')
                END

            DECLARE @masterCount INT, @Name VARCHAR(30)
            SELECT @masterCount = COUNT(Name) FROM @Masters
            WHILE (@masterCount > 0)
                BEGIN
                    SELECT @Name  = Name FROM @Masters WHERE Sno = @masterCount

                    IF(@Name = 'PRICINGTYPE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''PRICINGTYPE'' [MasterName],
                                            (SELECT inPricingTypeID [id], vcTypeName [name], inNoOfDays [noOfDays]
                                                FROM TblMst_PricingType(NOLOCK)
                                                WHERE btIsActive = 1
                                                ORDER BY inNoOfDays
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'PRICINGAPPROACH')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''PRICINGAPPROACH'' [MasterName],
                                            (SELECT inApproachID [id], vcApproachName [name]
                                                FROM TblMst_PricingApproach(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'AWBCOSTAPPROACH')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''AWBCOSTAPPROACH'' [MasterName],
                                            (SELECT inApproachID [id], vcApproachName [name]
                                                FROM TblMst_PerAWBCostApproach(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'PRICINGTYPE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''PRICINGTYPE'' [MasterName],
                                            (SELECT inPricingTypeID [id], vcTypeName [name], inNoOfDays [noOfDays]
                                                FROM TblMst_PricingType(NOLOCK)
                                                WHERE btIsActive = 1
                                                ORDER BY inNoOfDays
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'PRODUCT')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''PRODUCT'' [MasterName],
                                            (SELECT inProductID [id], vcProductName [name]
                                                FROM TblMst_Product(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'SERVICE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''SERVICE'' [MasterName],
                                            (SELECT inServiceID [id], vcServiceName [name]
                                                FROM TblMst_Services(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'USERTYPE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''USERTYPE'' [MasterName],
                                            (SELECT inUserTypeID [id], vcUserTypeName [name]
                                                FROM TblMst_UserType(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'DEPARTMENT')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''DEPARTMENT'' [MasterName],
                                            (SELECT inDepartmentID [id], vcDepartmentName [name]
                                                FROM TblMst_Department(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'DEPARTMENT')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''DEPARTMENT'' [MasterName],
                                            (SELECT inDepartmentID [id], vcDepartmentName [name]
                                                FROM TblMst_Department(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'AIRLINE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''AIRLINE'' [MasterName],
                                            (SELECT Sno [id], AirlineName [name]
                                                FROM TblMst_Airline(NOLOCK)
                                                 WHERE IsActive = 1
                                                 FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'INDUSTRY')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''INDUSTRY'' [MasterName],
                                            (SELECT inIndustryID [id], vcIndustryName [name]
                                                FROM TblMst_Industry(NOLOCK)
                                                WHERE btIsActive = 1
       FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'DESIGNATION')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''DESIGNATION'' [MasterName],
                                            (SELECT inDesignationID [id], vcDesignationName [name]
                                                FROM TblMst_Designation(NOLOCK)
                                                WHERE btIsActive = 1
                                                FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'CITY')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''CITY'' [MasterName],
                                            (SELECT DISTINCT CT.Sno [id], CityName [name], CityCode [code], CountrySNo [countryId]
                                                FROM TblMst_City CT(NOLOCK)
                                                INNER JOIN TblMst_Country CTR(NOLOCK)
                                                    ON CT.CountrySNo = CTR.SNo AND CTR.ISDCode IS NOT NULL
                                                WHERE IsActive = 1
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'COUNTRY')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''COUNTRY'' [MasterName],
                                            (SELECT DISTINCT Sno [id], CountryName [name], CountryCode [code], ''+''+CAST(ISDCode AS VARCHAR) [isd]
                                            FROM TblMst_Country(NOLOCK)
                                            WHERE ISDCode IS NOT NULL
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'CURRENCY')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''CURRENCY'' [MasterName],
                                            (SELECT DISTINCT Sno [id], CurrencyName [name], CurrencyCode [code]
                                            FROM TblMst_Currency(NOLOCK)
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'STATE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''STATE'' [MasterName],
                                            (SELECT id, name FROM (
                                                SELECT 2 [id], ''Uttrakhand'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''Himanchal Pradesh'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'CONTINENT')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''CONTINENT'' [MasterName],
                                            (SELECT id, name FROM (
                                                SELECT 2 [id], ''North America'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''South America'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'IATACODE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''IATACODE'' [MasterName],
                                            (SELECT id, name FROM (
                                           SELECT 2 [id], ''IATA 1'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''IATA 2'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'CLASSIFICATION')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''CLASSIFICATION'' [MasterName],
                                            (SELECT id, name FROM (
                                                SELECT 2 [id], ''Low income'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''Upper income'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'TIMEZONE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''TIMEZONE'' [MasterName],
                                            (SELECT id, name FROM (
                                                SELECT 2 [id], ''UTC+06:30 India'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''UTC+13:00 Samoa'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'ZONE')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''ZONE'' [MasterName],
                                            (SELECT id, name FROM (
                                                SELECT 2 [id], ''Europe'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''Korea'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'SHC')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''SHC'' [MasterName],
                                            (SELECT id, name FROM (
                                                SELECT 2 [id], ''SHC 1'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''SHC 2'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END
                    IF(@Name = 'DGCLASS')
                        BEGIN
                            SET @Sql = @Sql + ' UNION ALL
                                        SELECT ''DGCLASS'' [MasterName],
                                            (SELECT id, name FROM (
                                                SELECT 2 [id], ''Class 1'' [name]
                                                UNION ALL
                                                SELECT 3 [id], ''Class 2'' [name]
                                                ) A
                                            FOR JSON PATH) MasterData'
                        END


                    SET @masterCount = @masterCount - 1;
                END

                EXEC(@Sql)
        END 

     