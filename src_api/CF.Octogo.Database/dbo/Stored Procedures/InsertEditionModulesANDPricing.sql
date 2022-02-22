/*
    CREATED ON : 27 Oct 2021
    DESC : 
    DRY RUN : 
    exec InsertEditionModulesANDPricing @EditionId=82,@ProductId=1,@ModuleData=N'[{"EditionModuleId":171,"PageModuleId":617,"ModuleName":"Dashboard","SubModuleList":null}]',
    @Name='sd54d',@ApproachId=1,@LoginUserId=1,@isEdit=1
rollback
*/
CREATE PROCEDURE InsertEditionModulesANDPricing
    (
    @ProductId INT,
    @Name VARCHAR(100), 
    @ExpiringEditionId INT = NULL, 
    @TrialDayCount INT = NULL,
    @WaitingDayAfterExpire INT = NULL,
    @EditionId INT ,
    @ModuleData NVARCHAR(MAX),
    @PricingData NVARCHAR(MAX) = NULL,
    @DependantEditionID INT = NULL,
    @ApproachId INT = NULL,
    @LoginUserId INT,
    @isEdit BIT = 0
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION
        SET NOCOUNT ON;
        DECLARE @ModuleOutputTable AS TABLE (ModuleId INT,ModuleName VARCHAR(100))
        DECLARE @RowCount INT;

        IF(@ApproachId IS NULL)
            BEGIN
                SET @ApproachId = (SELECT TOP 1 inApproachID FROM TblMst_PricingApproach WHERE btIsActive = 1)
            END
        SELECT DISTINCT EditionModuleId, ModuleName, SubModuleId, SubModuleName, NULL AS ParentModuleId, PageModuleId
            INTO #ModuleList
            FROM(
                SELECT DISTINCT EditionModuleId,ModuleName, null AS SubModuleId, SubModuleName, PageModuleId
                    FROM OPENJSON(@ModuleData)
                    WITH(EditionModuleId INT '$.EditionModuleId', ModuleName Varchar(100) '$.ModuleName',SubModuleName VARCHAR(100), 
                        PageModuleId INT '$.PageModuleId')
                UNION ALL
                SELECT EditionModuleId, ModuleName, SubModuleId, SubModuleName, PageModuleId
                    FROM OPENJSON(@ModuleData)
                        WITH(EditionModuleId INT '$.EditionModuleId', ModuleName Varchar(100) '$.ModuleName',
                        SubModuleList NVARCHAR(MAX) N'$.SubModuleList'  AS JSON)
                    OUTER APPLY
		            OpenJson(SubModuleList)
		                WITH (SubModuleId INT '$.EditionModuleId', SubModuleName Varchar(100) N'$.ModuleName',PageModuleId INT '$.PageModuleId') as SubModule
                ) AS Modules

            DELETE FROM #ModuleList WHERE PageModuleId IS NULL

            SELECT PricingTypeId, Amount, DiscountPercentage
                INTO #PricingList
                FROM OPENJSON(@PricingData)
                WITH(PricingTypeId INT '$.PricingTypeId',
                     Amount DECIMAL(18,2) '$.Amount',
                     DiscountPercentage DECIMAL(18,2) '$.DiscountPercentage')
     
            IF(@isEdit = 0)
                BEGIN
                    -- Insert Approach Edition mapping
                    INSERT INTO TblTrn_ApproachEditionMapping(inEditionID, inApproachID, btIsActive, dtCreatedOn, inCreatedBy)
                        VALUES(@EditionId, @ApproachId, 1, GETDATE(), @LoginUserId)

                    -- Insert Product Edition mapping
                    INSERT INTO TblTrn_ProductEditionMapping(inProductId, inEditionId, btIsActive, dtCreatedOn, inCreatedBy)
                        VALUES (@ProductId, @EditionId, 1, GETDATE(), @LoginUserId)

                    -- Insert Modules data
                    INSERT INTO TblTrn_EditionModules
                        (inEditionId, vcModuleName, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                        OUTPUT Inserted.inModuleID AS [ModuleId],Inserted.vcModuleName AS [ModuleName] 
                            INTO  @ModuleOutputTable
                        SELECT DISTINCT @EditionId, ModuleName, 1, GETDATE(), @LoginUserId, PageModuleId
                        FROM #ModuleList
                        WHERE SubModuleName IS NULL

                    

                    -- Update parent module Id for Sub-modules
                    UPDATE M SET ParentModuleId = O.ModuleId 
                      FROM #ModuleList M
                        INNER JOIN @ModuleOutputTable O
                            ON M.ModuleName = O.ModuleName
                        WHERE M.SubModuleName IS NOT NULL
            
                    -- Insert Sub-modules data
                    INSERT INTO TblTrn_SubModules
                        (vcSubModuleName, inModuleId, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                    SELECT DISTINCT SubModuleName, ParentModuleId, 1, GETDATE(), @LoginUserId, PageModuleId
                    FROM #ModuleList
                    WHERE SubModuleName IS NOT NULL
            
                    -- Create Edition Dependency
                    IF(@DependantEditionID > 0)
                        BEGIN
                            INSERT INTO TblTrn_EditionDependancy
                                (inEditionId, inDependantEditionID, btIsActive, dtCreatedOn, inCreatedBy)
                            VALUES
                                (@EditionId, @DependantEditionID, 1, GETDATE(), @LoginUserId)
                            
                            -- Insert Edition Addon Modules data
                            SELECT ROW_NUMBER() over (Order By [ModuleId]) AS IndexNumber, ModuleId 
                                INTO #TempModuleData
                                FROM @ModuleOutputTable
                            DECLARE @site_value INT, @main_Value INT, @TempModuleId INT
				            SET @site_value = 1;
				            Select @main_Value = count(IndexNumber) FROM #TempModuleData

				            WHILE @site_value <= @main_Value
                               BEGIN
                                    SELECT @TempModuleId = ModuleId FROM #TempModuleData WHERE IndexNumber=@site_value

                                   EXEC InsertUpdateAddonAndPricing 
                                    @ModuleId = @TempModuleId, 
                                    @ProductId = @ProductId, 
                                    @EditionID = @DependantEditionID, 
                                    @ApproachId = @ApproachId, 
                                    @IsStandAlone = 0, 
                                    @LoginUserId = @LoginUserId 
                                
                                SET @site_value = @site_value + 1;
                               END;
                            DROP TABLE #TempModuleData
                        END
            
                    -- Insert Pricing data
                    IF((SELECT COUNT(PricingTypeId) FROM #PricingList) > 0)
                        BEGIN
                            INSERT INTO TblTrn_EditionPricing_Prepaid
                                        (inEditionID, inPricingTypeID, dcAmount, dcDiscountPercentage, btIsActive, dtCreatedOn, inCreatedBy)
                                SELECT @EditionId, PricingTypeId, Amount, DiscountPercentage, 1, GETDATE(), @LoginUserId
                                FROM #PricingList
                    END
                    SELECT @EditionId [Id]
                END
            ELSE
                BEGIN
                    -- Update Edition Here
                    UPDATE AbpEditions SET  
                        DisplayName = @Name,
                        Name = @Name,
                        ExpiringEditionId = @ExpiringEditionId,
                        TrialDayCount = @TrialDayCount,
                        WaitingDayAfterExpire = @WaitingDayAfterExpire,
                        LastModifierUserId = @LoginUserId,
                        LastModificationTime = GETDATE()
                        WHERE Id= @EditionId

                    -- Update Approach linking
                    UPDATE TblTrn_ApproachEditionMapping SET
                        inApproachID = @ApproachId,
                        dtModifiedOn = GETDATE(),
                        inModifiedBy = @LoginUserId
                        WHERE inEditionID = @EditionId AND btIsActive = 1

                    -- deactivate Edition Modules
                        ; WITH Dependency_CTE AS
                        (
                            SELECT inDependantEditionID, inEditionID 
                                FROM TblTrn_EditionDependancy (NOLOCK) 
                                WHERE btIsActive = 1 and inEditionID = @EditionId
                            UNION ALL
                            SELECT  ED.inDependantEditionID, ED.inEditionID 
                                FROM TblTrn_EditionDependancy ED (NOLOCK)
                                INNER JOIN Dependency_CTE CTE 
                                    ON CTE.inDependantEditionID = ED.inEditionID
                                WHERE ED.btIsActive = 1
                        )
                        SELECT DISTINCT E.Id,E.DisplayName 
                            INTO #DependentEditions
                            FROM Dependency_CTE CTE
                            INNER JOIN AbpEditions E (NOLOCK)
                                ON E.Id = CTE.inDependantEditionID AND E.IsDeleted = 0

                        -- Get Modules data of dependent heirarchy
                        SELECT DE.Id, DE.DisplayName,EM.inModuleID [ModuleId], EM.vcModuleName [ModuleName] 
                            INTO #DependentEditionModules
                            FROM TblTrn_EditionModules EM (NOLOCK)
                            INNER JOIN #DependentEditions DE 
                                ON EM.inEditionID = DE.Id AND EM.btIsActive = 1


                         SELECT inModuleID [ModuleId]
                                INTO #DeletedModuleIds
                            FROM TblTrn_EditionModules EM (NOLOCK)
                            LEFT JOIN #DependentEditionModules DEM
                                ON DEM.ModuleName = EM.vcModuleName
                            WHERE EM.inEditionID = @EditionId AND btIsActive = 1
                                AND DEM.ModuleId IS NULL

                        DELETE FROM #DeletedModuleIds
                            WHERE ModuleId IN(SELECT EditionModuleId FROM #ModuleList)

                        UPDATE TblTrn_SubModules SET btIsActive = 0 
                            WHERE inModuleId 
                            IN(SELECT ModuleId FROM #DeletedModuleIds)

                        UPDATE TblTrn_EditionModules SET btIsActive = 0 
                            WHERE inModuleId IN(SELECT ModuleId FROM #DeletedModuleIds)

                    -- Deactivate Edition Sub-Modules
                        UPDATE TblTrn_SubModules SET btIsActive = 0 
                            WHERE inSubModuleID IN
                            (
                                SELECT DISTINCT SM.inSubModuleID
                                    FROM #ModuleList M 
                                    INNER JOIN TblTrn_SubModules SM 
                                        ON M.EditionModuleId = SM.inModuleID and sm.btIsActive = 1
                                    LEFT JOIN #ModuleList M1
                                        ON M1.SubmoduleId = SM.inSubModuleID
                                    WHERE M1.SubmoduleId IS NULL
                            )

                    -- Update Module data
                    UPDATE EM SET vcModuleName = T.ModuleName,
                                    InPageModuleId = T.PageModuleId,
                                    dtModifiedOn = GETDATE(),
                                    inModifiedBy = @LoginUserId
                        FROM TblTrn_EditionModules EM
                        INNER JOIN #ModuleList T
                            ON T.EditionModuleId = EM.inModuleID AND EM.btIsActive = 1
                        WHERE EM.inEditionID = @EditionId AND T.ParentModuleId IS NULL


                    -- Update Sub-Module data
                    UPDATE SM SET vcSubModuleName = T.SubModuleName,
                                InPageModuleId = T.PageModuleId,
                                dtModifiedOn = GETDATE(),
                                inModifiedBy = @LoginUserId
                        FROM TblTrn_SubModules SM
                        INNER JOIN #ModuleList T
                            ON T.SubModuleId = SM.inSubModuleID AND SM.btIsActive = 1
                        INNER JOIN TblTrn_EditionModules EM
                            ON EM.inModuleId = SM.inModuleId AND EM.btIsActive = 1
                        WHERE EM.inEditionID = @EditionId

                    -- -- Insert Modules data
                    INSERT INTO TblTrn_EditionModules
                        (inEditionId, vcModuleName, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                        OUTPUT Inserted.inModuleID AS [ModuleId],Inserted.vcModuleName AS [ModuleName] INTO  @ModuleOutputTable
                        SELECT DISTINCT @EditionId, ModuleName, 1, GETDATE(), @LoginUserId, PageModuleId
                        FROM #ModuleList
                        WHERE SubModuleName IS NULL AND ISNULL(EditionModuleId,0)=0

                    -- Update parent module Id for Sub-modules
                    UPDATE M SET ParentModuleId = O.ModuleId 
                                FROM #ModuleList M
                        INNER JOIN @ModuleOutputTable O
                        ON M.ModuleName = O.ModuleName
                                WHERE M.SubModuleName IS NOT NULL AND ISNULL(EditionModuleId,0)=0

                    Update M1 SET M1.ParentModuleId = M2.EditionModuleId
                    FROM #ModuleList M1
                    INNER JOIN #ModuleList M2 
                        ON M1.ModuleName = M2.ModuleName --AND M2.SubModuleName IS NULL  
                    WHERE M1.ParentModuleId IS NULL AND M2.EditionModuleId IS NOT NULL  
                        AND M1.SubModuleName IS NOT NULL AND ISNULL(M1.SubModuleId,0)=0    

                    -- Insert Sub-modules data
                    INSERT INTO TblTrn_SubModules
                        (vcSubModuleName, inModuleId, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                        SELECT DISTINCT SubModuleName, ParentModuleId, 1, GETDATE(), @LoginUserId, PageModuleId
                        FROM #ModuleList
                        WHERE SubModuleName IS NOT NULL AND ISNULL(SubModuleId,0)=0 

            
                    -- Update Pricing data
                    IF((SELECT COUNT(PricingTypeId) FROM #PricingList) > 0)
                        BEGIN
                            UPDATE EPP SET
                                dcAmount = PL.Amount,
                                dcDiscountPercentage = PL.DiscountPercentage,
                                dtModifiedOn = GETDATE(),
                                inModifiedBy = @LoginUserId
                            -- select distinct PL.*
                            FROM TblTrn_EditionPricing_Prepaid EPP
                                INNER JOIN #PricingList PL 
                                    ON PL.PricingTypeId = EPP.inPricingTypeId
                                WHERE EPP.inEditionID = @EditionId AND EPP.btIsActive = 1

                            INSERT INTO TblTrn_EditionPricing_Prepaid
                                    (inEditionID, inPricingTypeID, dcAmount, dcDiscountPercentage, btIsActive, dtCreatedOn, inCreatedBy)
                                SELECT @EditionId, PL.PricingTypeId, PL.Amount, PL.DiscountPercentage, 1, GETDATE(), @LoginUserId
                                    FROM #PricingList PL
                                    LEFT JOIN TblTrn_EditionPricing_Prepaid EPP
                                        ON EPP.inEditionID = @EditionId AND
                                        PL.PricingTypeId = EPP.inPricingTypeId AND EPP.btIsActive = 1
                                    WHERE EPP.inPricingTypeId IS NULL
                        END
                    ELSE
                        BEGIN
                            UPDATE TblTrn_EditionPricing_Prepaid
                                SET btIsActive = 0, 
                                inModifiedBy = @LoginUserId,
                                dtModifiedOn = GETDATE()
                                WHERE inEditionID = @EditionId AND btIsActive = 1
                        END
                    
                    SELECT @EditionId [Id]
                END
            -- DROP TABLE #ModuleList              
            -- DROP TABLE #PricingList
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
                --IF @@TRANCOUNT > 0
				ROLLBACK
		  
				DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
				SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()

				RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END