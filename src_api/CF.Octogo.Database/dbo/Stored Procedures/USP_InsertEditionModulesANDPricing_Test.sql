/*
*************************************************************************************
Procedure Name	:	USP_InsertEditionModulesANDPricing 
Purpose		    :	Insert edition modules data and pricing
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   27 Oct 2021
Modified By (On):	rollback 
Description		:	
    exec USP_InsertEditionModulesANDPricing_Test @EditionId=212,@ProductId=1,
    @ModuleData=N'[{"EditionModuleId":515,"PageModuleId":16,"ModuleName":"Master","SubModuleList":[{"EditionModuleId":478,"PageModuleId":9,"ModuleName":"Geographical Settings","SubModuleList":[{"EditionModuleId":479,"PageModuleId":2,"ModuleName":"Country","SubModuleList":null},{"EditionModuleId":480,"PageModuleId":15,"ModuleName":"Time Zone","SubModuleList":null},{"EditionModuleId":null,"PageModuleId":323,"ModuleName":"Airline Hub","SubModuleList":null},{"EditionModuleId":null,"PageModuleId":620,"ModuleName":"City Connection Time Priority","SubModuleList":null}]}]},{"EditionModuleId":null,"PageModuleId":17,"ModuleName":"Manage","SubModuleList":[{"EditionModuleId":null,"PageModuleId":50,"ModuleName":"Connection Type","SubModuleList":null},{"EditionModuleId":null,"PageModuleId":232,"ModuleName":"Alert Events","SubModuleList":null}]}]',
    @Name='nGen10',@ApproachId=2,@LoginUserId=1,@isEdit=1
*************************************************************************************
*/
CREATE PROCEDURE USP_InsertEditionModulesANDPricing_Test
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
        DECLARE @ModuleOutputTable AS TABLE (ModuleId INT,ModuleName VARCHAR(100), PageModuleId INT)
        DECLARE @SubModuleOutputTable AS TABLE (SubModuleId INT,ModuleName VARCHAR(100), PageModuleId INT, ModuleId INT)
        DECLARE @RowCount INT;
        DECLARE @DeactivatedSubModuleIds TABLE(Id INT);

        IF(@ApproachId IS NULL)
            BEGIN
                SET @ApproachId = (SELECT TOP 1 inApproachID FROM TblMst_PricingApproach WHERE btIsActive = 1)
            END
            SELECT DISTINCT EditionModuleId, ModuleName, SubModuleId, SubModuleName, NULL AS ParentModuleId, PageModuleId,
                    SubSubModuleId, SubSubModuleName
                INTO #ModuleList
                FROM(
                    SELECT DISTINCT EditionModuleId,ModuleName, null AS SubModuleId, NULL SubModuleName,NULL SubSubModuleId, NULL SubSubModuleName, PageModuleId
                        FROM OPENJSON(@ModuleData)
                        WITH(EditionModuleId INT '$.EditionModuleId', ModuleName Varchar(100) '$.ModuleName',
                            PageModuleId INT '$.PageModuleId')
                    UNION ALL
                    SELECT SubModule.SubModuleId EditionModuleId, ModuleName, SubModule.SubModuleId, SubModule.SubModuleName,NULL SubSubModuleId, NULL SubSubModuleName, SubModule.PageModuleId
                        FROM OPENJSON(@ModuleData)
                            WITH(EditionModuleId INT '$.EditionModuleId', ModuleName Varchar(100) '$.ModuleName',
                            SubModuleList NVARCHAR(MAX) N'$.SubModuleList'  AS JSON)
                        CROSS APPLY
		                OpenJson(SubModuleList)
		                    WITH (SubModuleId INT '$.EditionModuleId', SubModuleName Varchar(100) N'$.ModuleName',PageModuleId INT '$.PageModuleId',SubSubModuleList nvarchar(max) N'$.SubModuleList' as json) as SubModule
                    UNION ALL
                    SELECT SubSubModule.SubModuleId EditionModuleId, ModuleName, SubModule.SubModuleId, SubModule.SubModuleName,SubSubModule.SubModuleId SubSubModuleId, SubSubModule.SubModuleName SubSubModuleName, SubSubModule.PageModuleId
                        FROM OPENJSON(@ModuleData)
                            WITH(EditionModuleId INT '$.EditionModuleId', ModuleName Varchar(100) '$.ModuleName',
                            SubModuleList NVARCHAR(MAX) N'$.SubModuleList'  AS JSON)
                        CROSS APPLY
		                OpenJson(SubModuleList)
		                    WITH (SubModuleId INT '$.EditionModuleId', SubModuleName Varchar(100) N'$.ModuleName',PageModuleId INT '$.PageModuleId',SubSubModuleList nvarchar(max) N'$.SubModuleList' as json) as SubModule
                        CROSS APPLY
                        OpenJson(SubModule.SubSubModuleList)
		                    WITH (SubModuleId INT '$.EditionModuleId', SubModuleName Varchar(100) '$.ModuleName',PageModuleId INT '$.PageModuleId') as SubSubModule
                    
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
                    -- Insert Edition Details
                    INSERT INTO AbpEditions(CreationTime, CreatorUserId, DisplayName, IsDeleted, Name, Discriminator, ExpiringEditionId, TrialDayCount,WaitingDayAfterExpire)
                        VALUES(GETDATE(), @LoginUserId, @Name, 0, @Name, 'SubscribableEdition', @ExpiringEditionId, @TrialDayCount, @WaitingDayAfterExpire)

                    SELECT @EditionId = SCOPE_IDENTITY();

                    -- Insert Approach Edition mapping
                    INSERT INTO TblTrn_ApproachEditionMapping(inEditionID, inApproachID, btIsActive, dtCreatedOn, inCreatedBy)
                        VALUES(@EditionId, @ApproachId, 1, GETDATE(), @LoginUserId)

                    -- Insert Product Edition mapping
                    INSERT INTO TblTrn_ProductEditionMapping(inProductId, inEditionId, btIsActive, dtCreatedOn, inCreatedBy)
                        VALUES (@ProductId, @EditionId, 1, GETDATE(), @LoginUserId)

                    -- Insert Modules data
                    INSERT INTO TblTrn_EditionModules
                        (inEditionId, vcModuleName, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                        OUTPUT Inserted.inModuleID AS [ModuleId],Inserted.vcModuleName [ModuleName],Inserted.InPageModuleId AS [PageModuleId] 
                            INTO  @ModuleOutputTable
                    SELECT DISTINCT @EditionId, ModuleName, 1, GETDATE(), @LoginUserId, PageModuleId
                        FROM #ModuleList
                        WHERE SubModuleName IS NULL
                        AND SubSubModuleName IS NULL

                    

                    -- Update parent module Id for Sub-modules
                    UPDATE M SET ParentModuleId = O.ModuleId 
                      FROM #ModuleList M
                        INNER JOIN @ModuleOutputTable O
                            ON M.ModuleName = O.ModuleName
                        WHERE M.SubModuleName IS NOT NULL
                        AND M.SubSubModuleName IS NULL

                    -- Insert Sub-modules data
                    INSERT INTO TblTrn_SubModules
                        (vcSubModuleName, inModuleId, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                        OUTPUT Inserted.inSubModuleID AS [SubModuleId],Inserted.vcSubModuleName [ModuleName]
                                ,Inserted.InPageModuleId AS [PageModuleId], Inserted.inModuleId [ModuleId] 
                           INTO  @SubModuleOutputTable
                    SELECT DISTINCT SubModuleName, ParentModuleId, 1, GETDATE(), @LoginUserId, PageModuleId
                    FROM #ModuleList
                    WHERE SubModuleName IS NOT NULL
                    AND SubSubModuleName IS NULL

                    -- Update parent module Id for Sub-Sub-modules
                    UPDATE M SET ParentModuleId = O.SubModuleId 
                      FROM #ModuleList M
                        INNER JOIN @SubModuleOutputTable O
                            ON M.SubModuleName = O.ModuleName
                        WHERE M.SubSubModuleName IS NOT NULL

                    -- Insert Sub-Sub-modules data
                    INSERT INTO TblTrn_SubModules
                        (vcSubModuleName, inModuleId,InParantID, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                    SELECT DISTINCT SSM.SubSubModuleName, SM.ModuleId,SSM.ParentModuleId, 1, GETDATE(), @LoginUserId, SSM.PageModuleId
                    FROM #ModuleList SSM 
                    INNER JOIN @SubModuleOutputTable SM
                        ON SSM.ParentModuleId = SM.SubModuleId
                    WHERE SubSubModuleName IS NOT NULL

            
                    -- Create Edition Dependency
                    IF(@DependantEditionID > 0)
                        BEGIN
                            INSERT INTO TblTrn_EditionDependancy
                                (inEditionId, inDependantEditionID, btIsActive, dtCreatedOn, inCreatedBy)
                            VALUES
                                (@EditionId, @DependantEditionID, 1, GETDATE(), @LoginUserId)
                        END
            
                    -- Insert Pricing data
                    IF((SELECT COUNT(PricingTypeId) FROM #PricingList) > 0)
                        BEGIN
                            INSERT INTO TblTrn_EditionPricing_Prepaid
                                        (inEditionID, inPricingTypeID, dcAmount, dcDiscountPercentage, btIsActive, dtCreatedOn, inCreatedBy)
                                SELECT @EditionId, PricingTypeId, Amount, DiscountPercentage, 1, GETDATE(), @LoginUserId
                                FROM #PricingList
                    END
                END
            ELSE IF(@isEdit = 1)
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

                        -- Deactivate Sub-module and SubSub module of removed module
                        UPDATE TblTrn_SubModules SET 
                            btIsActive = 0,
                            dtModifiedOn = GETDATE(),
                            inModifiedBy = @LoginUserId 
                            WHERE inModuleId 
                            IN(SELECT ModuleId FROM #DeletedModuleIds)

                        -- Deactivate removed modules
                        UPDATE TblTrn_EditionModules SET 
                            btIsActive = 0, 
                            dtModifiedOn = GETDATE(),
                            inModifiedBy = @LoginUserId 
                            WHERE inModuleId IN(SELECT ModuleId FROM #DeletedModuleIds)

                    
                        INSERT INTO @DeactivatedSubModuleIds(Id)
                        SELECT DISTINCT SM.inSubModuleID 
                                    FROM #ModuleList M 
                                    INNER JOIN TblTrn_SubModules SM 
                                        ON M.EditionModuleId = SM.inModuleID and sm.btIsActive = 1
                                    LEFT JOIN #ModuleList M1
                                        ON M1.SubmoduleId = SM.inSubModuleID
                                    WHERE M1.SubmoduleId IS NULL

                        -- Deactivate Edition Sub-Modules those updated under existing module
                        UPDATE TblTrn_SubModules SET 
                            btIsActive = 0,
                            dtModifiedOn = GETDATE(),
                            inModifiedBy = @LoginUserId  
                            WHERE inSubModuleID IN
                            (
                               SELECT Id FROM @DeactivatedSubModuleIds 
                            )
                        
                        -- Deactivate Edition SubSub-Modules for removed Sub module
                        UPDATE TblTrn_SubModules SET 
                            btIsActive = 0,
                            dtModifiedOn = GETDATE(),
                            inModifiedBy = @LoginUserId  
                            WHERE InParantID IN
                            (
                               SELECT Id FROM @DeactivatedSubModuleIds 
                            )

                    -- Update Module data
                    -- UPDATE EM SET vcModuleName = T.ModuleName,
                    --                 InPageModuleId = T.PageModuleId,
                    --                 dtModifiedOn = GETDATE(),
                    --                 inModifiedBy = @LoginUserId                        
                    --     FROM TblTrn_EditionModules EM
                    --     INNER JOIN #ModuleList T
                    --         ON T.EditionModuleId = EM.inModuleID AND EM.btIsActive = 1
                    --     WHERE EM.inEditionID = @EditionId AND T.ParentModuleId IS NULL


                    -- Update Sub-Module data
                    -- UPDATE SM SET vcSubModuleName = T.SubModuleName,
                    --         InPageModuleId = T.PageModuleId,
                    --             dtModifiedOn = GETDATE(),
                    --             inModifiedBy = @LoginUserId
                    --     FROM TblTrn_SubModules SM
                    --     INNER JOIN #ModuleList T
                    --         ON T.SubModuleId = SM.inSubModuleID AND SM.btIsActive = 1
                    --     INNER JOIN TblTrn_EditionModules EM
                    --         ON EM.inModuleId = SM.inModuleId AND EM.btIsActive = 1
                    --     WHERE EM.inEditionID = @EditionId

                    -- -- Insert Modules data
                    INSERT INTO TblTrn_EditionModules
                        (inEditionId, vcModuleName, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                        OUTPUT Inserted.inModuleID AS [ModuleId],Inserted.vcModuleName [ModuleName],Inserted.InPageModuleId AS [PageModuleId] 
                        INTO  @ModuleOutputTable
                        SELECT DISTINCT @EditionId, ModuleName, 1, GETDATE(), @LoginUserId, PageModuleId
                        FROM #ModuleList
                        WHERE SubModuleName IS NULL AND ISNULL(EditionModuleId,0)=0
                        AND SubSubModuleName IS NULL

                    -- Update parent module Id for Sub-modules
                    UPDATE M SET ParentModuleId = O.ModuleId 
                                FROM #ModuleList M
                        INNER JOIN @ModuleOutputTable O
                        ON M.ModuleName = O.ModuleName
                                WHERE M.SubModuleName IS NOT NULL AND ISNULL(EditionModuleId,0)=0
                                AND M.SubSubModuleName IS NULL

                    Update M1 SET M1.ParentModuleId = M2.EditionModuleId
                    FROM #ModuleList M1
                    INNER JOIN #ModuleList M2 
                        ON M1.ModuleName = M2.ModuleName --AND M2.SubModuleName IS NULL  
                    WHERE M1.ParentModuleId IS NULL AND M2.EditionModuleId IS NOT NULL  
                        AND M1.SubModuleName IS NOT NULL AND ISNULL(M1.SubModuleId,0)=0 
                        AND M1.SubSubModuleName IS NULL   

                    -- Insert Sub-modules data
                    INSERT INTO TblTrn_SubModules
                        (vcSubModuleName, inModuleId, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                        OUTPUT Inserted.inSubModuleID AS [SubModuleId],Inserted.vcSubModuleName [ModuleName]
                                ,Inserted.InPageModuleId AS [PageModuleId], Inserted.inModuleId [ModuleId] 
                           INTO  @SubModuleOutputTable
                        SELECT DISTINCT SubModuleName, ParentModuleId, 1, GETDATE(), @LoginUserId, PageModuleId
                        FROM #ModuleList
                        WHERE SubModuleName IS NOT NULL AND ISNULL(SubModuleId,0)=0 
                        AND SubSubModuleName IS NULL

                    -- Update parent module Id for Sub-Sub-modules
                    UPDATE M SET ParentModuleId = M1.SubModuleId 
                      FROM #ModuleList M
                        INNER JOIN #ModuleList M1
                            ON M.SubModuleName = M1.SubModuleName
                        WHERE M.SubSubModuleName IS NOT NULL
                        AND M1.SubModuleName IS NOT NULL

                    -- Insert Sub-Sub-modules data
                    INSERT INTO TblTrn_SubModules
                        (vcSubModuleName, inModuleId,InParantID, btIsActive, dtCreatedOn, inCreatedBy, InPageModuleId)
                    SELECT DISTINCT SSM.SubSubModuleName, SM.inModuleId, SSM.ParentModuleId, 1, GETDATE(), @LoginUserId, SSM.PageModuleId
                    FROM #ModuleList SSM 
                    -- INNER JOIN @SubModuleOutputTable SM
                    --     ON SSM.ParentModuleId = SM.SubModuleId
                    INNER JOIN TblTrn_SubModules SM 
                        ON SM.inSubModuleID = SSM.ParentModuleId AND SM.btIsActive = 1
                    WHERE SubSubModuleName IS NOT NULL

            
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
                    
                    
                END
            -- DROP TABLE #ModuleList              
            -- DROP TABLE #PricingList
        COMMIT TRANSACTION
        SELECT @EditionId [Id]
    END TRY
    BEGIN CATCH
                --IF @@TRANCOUNT > 0
				ROLLBACK
		  
				DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
				SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()

				RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END