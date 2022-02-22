/*
*************************************************************************************
Procedure Name	:	USP_InsertUpdateAddonAndPricing 
Purpose		    :	Insert Addon, Addon modules data and pricing
Company		    :   CargoFlash InfoTech. 
Scope			:	
Author			:	Hari Krashna
Created On		:   25 Nov 2021
Modified By (On):	Hari Krashna(13/01/2022)
Description		:	
EXEC USP_InsertUpdateAddonAndPricing @AddonName='sddf21',@ProductId=1,@EditionID=212,@ApproachId=2,@LoginUserId=1,@AddonId=24,
@ModuleList=N'[{"EditionModuleId":529,"PageModuleId":62,"ModuleName":"Schedule","SubModuleList":[{"EditionModuleId":535,"PageModuleId":655,"ModuleName":"Flight","SubModuleList":[{"EditionModuleId":537,"PageModuleId":65,"ModuleName":"Create Schedule","SubModuleList":null},{"EditionModuleId":538,"PageModuleId":356,"ModuleName":"Search Flight Schedule","SubModuleList":null}]},{"EditionModuleId":536,"PageModuleId":326,"ModuleName":"Route","SubModuleList":null}]}]'
with recompile
select * from TblTrn_addon
select * from TblTrn_AddonModule_SubModule_SubSubModuleMapping
*************************************************************************************
*/
CREATE PROCEDURE USP_InsertUpdateAddonAndPricing
    (
    @AddonName VARCHAR(100),
    @ProductId INT,
    @AddonId INT = NULL, 
    @EditionID INT,
    @ApproachId INT,
    @LoginUserId INT,
    @IsStandAlone BIT = 0,
    @Description VARCHAR(250) = NULL,
    @ModuleList NVARCHAR(MAX) = NULL,
    @PricingData NVARCHAR(MAX) = NULL
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION 
        SET NOCOUNT ON;
            DECLARE @ModuleOutputTable AS TABLE (ModuleMappingID INT,ModuleName VARCHAR(100));
            DECLARE @SubModuleOutputTable AS TABLE (ModuleMappingID INT,ModuleName VARCHAR(100), ParentMappingId INT);
            DECLARE @DeactivatedSubModuleIds TABLE(Id INT);

                    SELECT DISTINCT EditionModuleId, ModuleName, SubModuleId, SubModuleName, NULL AS ParentModuleId, PageModuleId, 
                        SubSubModuleId, SubSubModuleName
                        INTO #ModuleList
                        FROM(
                            SELECT DISTINCT EditionModuleId,ModuleName, null AS SubModuleId, SubModuleName, PageModuleId, NULL SubSubModuleId, NULL SubSubModuleName
                                FROM OPENJSON(@ModuleList)
                                WITH(EditionModuleId INT '$.EditionModuleId', ModuleName Varchar(100) '$.ModuleName',SubModuleName VARCHAR(100), 
                                    PageModuleId INT '$.PageModuleId')
                            UNION ALL
                            SELECT SubModule.SubModuleId EditionModuleId, ModuleName, SubModule.SubModuleId, SubModule.SubModuleName, PageModuleId, NULL SubSubModuleId, NULL SubSubModuleName
                                FROM OPENJSON(@ModuleList)
                                    WITH(EditionModuleId INT '$.EditionModuleId', ModuleName Varchar(100) '$.ModuleName',
                                    SubModuleList NVARCHAR(MAX) N'$.SubModuleList'  AS JSON)
                                OUTER APPLY
		                        OpenJson(SubModuleList)
		                            WITH (SubModuleId INT '$.EditionModuleId', SubModuleName Varchar(100) N'$.ModuleName',PageModuleId INT '$.PageModuleId',SubSubModuleList nvarchar(max) N'$.SubModuleList' as json) as SubModule
                            UNION ALL
                            SELECT SubSubModule.SubModuleId EditionModuleId, ModuleName, SubModule.SubModuleId, SubModule.SubModuleName, SubSubModule.PageModuleId [PageModuleId], SubSubModule.SubModuleId SubSubModuleId, SubSubModule.SubModuleName SubSubModuleName
                                FROM OPENJSON(@ModuleList)
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
            -- Insert Addon
            IF(ISNULL(@AddonId,0) = 0)
                BEGIN
                    INSERT INTO TblTrn_AddOn(inEditionId,vcAddOnName, vcDescription, btIsStandAlone, btIsActive, inCreatedBy, dtCreatedOn)
                        VALUES(@EditionID, @AddonName, @Description, @IsStandAlone, 1, @LoginUserId, GETDATE())

                    SEt @AddonId = SCOPE_IDENTITY()

                    INSERT INTO TblTrn_ApproachAddOnMapping(inAddOnID, inApproachID, btIsActive, inCreatedBy, dtCreatedOn)
                        VALUES(@AddonId, @ApproachId, 1, @LoginUserId, GETDATE())

                    -- Insert Modules data
                    INSERT INTO TblTrn_AddonModule_SubModule_SubSubModuleMapping
                        (inAddonId, inModuleId, vcModuleName, btIsActive, dtCreatedOn, inCreatedBy)
                        OUTPUT Inserted.inModuleMappingID AS [ModuleMappingID],Inserted.vcModuleName AS [ModuleName] 
                            INTO  @ModuleOutputTable
                        SELECT DISTINCT @AddonId, PageModuleId, ModuleName, 1, GETDATE(), @LoginUserId
                        FROM #ModuleList
                        WHERE SubModuleName IS NULL
                        AND SubSubModuleName IS NULL
                        

                    -- Update parent module Id for Sub-modules
                    UPDATE M SET ParentModuleId = O.ModuleMappingID 
                      FROM #ModuleList M
                        INNER JOIN @ModuleOutputTable O
                            ON M.ModuleName = O.ModuleName
                        WHERE M.SubModuleName IS NOT NULL
                        AND M.SubSubModuleName IS NULL
            
                    -- Insert Sub-modules data
                    INSERT INTO TblTrn_AddonModule_SubModule_SubSubModuleMapping
                        (inAddonId, inModuleId, vcModuleName, inParentModuleId, btIsActive, dtCreatedOn, inCreatedBy)
                        OUTPUT Inserted.inModuleMappingID AS [ModuleMappingID],Inserted.vcModuleName [ModuleName]
                                , Inserted.inParentModuleId [ParentMappingId]
                                INTO  @SubModuleOutputTable
                    SELECT DISTINCT @AddonId, PageModuleId, SubModuleName, ParentModuleId, 1, GETDATE(), @LoginUserId
                    FROM #ModuleList
                    WHERE SubModuleName IS NOT NULL
                    AND SubSubModuleName IS NULL

                    -- Update parent module Id for Sub-Sub-modules
                    UPDATE M SET ParentModuleId = O.ModuleMappingID 
                      FROM #ModuleList M
                        INNER JOIN @SubModuleOutputTable O
                            ON M.SubModuleName = O.ModuleName
                        WHERE M.SubSubModuleName IS NOT NULL

                    -- Insert Sub-Sub-modules data
                    INSERT INTO TblTrn_AddonModule_SubModule_SubSubModuleMapping
                        (inAddonId, inModuleId, vcModuleName, inParentModuleId, btIsActive, dtCreatedOn, inCreatedBy)
                    SELECT DISTINCT @AddonId, SSM.PageModuleId,SSM.SubSubModuleName, SSM.ParentModuleId, 1, GETDATE(), @LoginUserId
                    FROM #ModuleList SSM 
                    INNER JOIN @SubModuleOutputTable SM
                        ON SSM.ParentModuleId = SM.ModuleMappingID
                    WHERE SSM.SubSubModuleName IS NOT NULL

                    -- Insert Pricing data
                    IF((SELECT COUNT(PricingTypeId) FROM #PricingList) > 0)
                        BEGIN
                            INSERT INTO TblTrn_AddonPricing_Prepaid
                                    (inAddOnID, inPricingTypeID, dcAmount, dcDiscountPercentage, btIsActive, dtCreatedOn, inCreatedBy)
                                SELECT @AddonId, PricingTypeId, Amount, DiscountPercentage, 1, GETDATE(), @LoginUserId
                                    FROM #PricingList
                        END				

                END
            -- Update Addon
            ELSE  
                BEGIN
                    UPDATE TblTrn_AddOn SET
                        vcAddOnName = @AddonName,
                        vcDescription = @Description,
                        inModifiedBy = @LoginUserId,
                        dtModifiedOn = GETDATE()
                        WHERE inAddOnID = @AddonId AND btIsActive = 1
                        
                    UPDATE TblTrn_ApproachAddOnMapping SET
                        inApproachID = @ApproachId,
                        dtModifiedOn = GETDATE(),
                        inModifiedBy = @LoginUserId
                        WHERE inAddOnID = @AddonId AND btIsActive = 1

                    ------------ update module and sub-module data---------

                    -- Insert newly added Modules
                    INSERT INTO TblTrn_AddonModule_SubModule_SubSubModuleMapping
                        (inAddonId, inModuleId, vcModuleName, btIsActive, dtCreatedOn, inCreatedBy)
                        OUTPUT Inserted.inModuleMappingID AS [ModuleMappingID],Inserted.vcModuleName AS [ModuleName] 
                            INTO  @ModuleOutputTable
                        SELECT DISTINCT @AddonId, PageModuleId, ModuleName, 1, GETDATE(), @LoginUserId
                        FROM #ModuleList
                        WHERE SubModuleName IS NULL
                        AND SubSubModuleName IS NULL
                        AND PageModuleId NOT IN(SELECT inModuleId  
                                                    FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping
                                                    WHERE inAddonId = @AddonId AND btIsActive = 1
                                                    AND inParentModuleId IS NULL
                                                )
                    -- update parent module Id for Sub-modules(newly added modules)
                    UPDATE M SET ParentModuleId = O.ModuleMappingID 
                      FROM #ModuleList M
                        INNER JOIN @ModuleOutputTable O
                            ON M.ModuleName = O.ModuleName
                        WHERE M.SubModuleName IS NOT NULL
                        AND M.SubSubModuleName IS NULL

                    -- update parent module Id for Sub-modules (for existing modules)
                    UPDATE child SET ParentModuleId = parent.inModuleMappingID
                      FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping parent
                        INNER JOIN #ModuleList child
                            ON parent.vcModuleName = child.ModuleName 
                        WHERE parent.inParentModuleId IS NULL
                        AND child.SubModuleName IS NOT NULL
                        AND child.SubSubModuleName IS NULL
                        AND parent.inAddonId = @AddonId
                        AND parent.btIsActive = 1


                    -- Insert Sub-modules data
                    INSERT INTO TblTrn_AddonModule_SubModule_SubSubModuleMapping
                        (inAddonId, inModuleId, vcModuleName, inParentModuleId, btIsActive, dtCreatedOn, inCreatedBy)
                        OUTPUT Inserted.inModuleMappingID AS [ModuleMappingID],Inserted.vcModuleName [ModuleName]
                                , Inserted.inParentModuleId [ParentMappingId]
                                INTO  @SubModuleOutputTable
                    SELECT DISTINCT @AddonId, PageModuleId, SubModuleName, ParentModuleId, 1, GETDATE(), @LoginUserId
                    FROM #ModuleList M
                    LEFT JOIN TblTrn_AddonModule_SubModule_SubSubModuleMapping module
                        ON  module.inAddonId = @AddonId 
                        AND M.PageModuleId = module.inModuleId
                        AND module.btIsActive = 1
                        AND module.inParentModuleId IS NOT NULL
                    WHERE M.SubModuleName IS NOT NULL
                    AND  M.SubSubModuleName IS NULL
                    AND module.inModuleMappingId IS NULL

                    -- Update parent module Id for Sub-Sub-modules(newly added sub-modules)
                    UPDATE M SET ParentModuleId = O.ModuleMappingID 
                      FROM #ModuleList M
                        INNER JOIN @SubModuleOutputTable O
                            ON M.SubModuleName = O.ModuleName
                        WHERE M.SubSubModuleName IS NOT NULL

                    -- update parent module Id for Sub-Sub-modules (for existing Sub-modules)
                    UPDATE child SET ParentModuleId = parent.inModuleMappingID
                      FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping parent
                        INNER JOIN #ModuleList child
                            ON parent.vcModuleName = child.SubModuleName 
                            -- AND child.SubModuleId = parent.inModuleID
                        WHERE parent.inParentModuleId IS NOT NULL
                        AND child.SubSubModuleName IS NOT NULL
                        AND parent.inAddonId = @AddonId
                        AND parent.btIsActive = 1


                    -- Insert Sub-Sub-modules data
                    INSERT INTO TblTrn_AddonModule_SubModule_SubSubModuleMapping
                        (inAddonId, inModuleId, vcModuleName, inParentModuleId, btIsActive, dtCreatedOn, inCreatedBy)
                    SELECT DISTINCT @AddonId, SSM.PageModuleId,SSM.SubSubModuleName, SSM.ParentModuleId, 1, GETDATE(), @LoginUserId
                    FROM #ModuleList SSM 
                    LEFT JOIN TblTrn_AddonModule_SubModule_SubSubModuleMapping AMSM 
                        ON AMSM.inModuleID = SSM.PageModuleId
                        AND AMSM.InAddonId = @AddonId AND AMSM.btIsActive = 1
                    WHERE SSM.SubSubModuleName IS NOT NULL
                    AND AMSM.inModuleMappingID IS NULL

                    -- Deactivate module data
                    UPDATE TblTrn_AddonModule_SubModule_SubSubModuleMapping
                        SET btIsActive = 0,
                        dtModifiedOn = GETDATE(),
                        inModifiedBy = @LoginUserId
                        WHERE InAddonId = @AddonId
                        AND inModuleId NOT IN(SELECT PageModuleId FROM #ModuleList)
                         

                    -- Update Pricing data
                    IF((SELECT COUNT(PricingTypeId) FROM #PricingList) > 0)
                        BEGIN
                            UPDATE APP SET
                                dcAmount = PL.Amount,
                                dcDiscountPercentage = PL.DiscountPercentage,
                                dtModifiedOn = GETDATE(),
                                inModifiedBy = @LoginUserId
                            FROM TblTrn_AddonPricing_Prepaid APP
                                INNER JOIN #PricingList PL 
                                    ON PL.PricingTypeId = APP.inPricingTypeId
                                WHERE APP.inAddonId = @AddonId AND APP.btIsActive = 1

                            INSERT INTO TblTrn_AddonPricing_Prepaid
                                    (inAddOnID, inPricingTypeID, dcAmount, dcDiscountPercentage, btIsActive, dtCreatedOn, inCreatedBy)
                                SELECT @AddonId, PL.PricingTypeId, PL.Amount, PL.DiscountPercentage, 1, GETDATE(), @LoginUserId
                                    FROM #PricingList PL
                                    LEFT JOIN TblTrn_AddonPricing_Prepaid APP
                                        ON APP.inAddonId = @AddonId 
                                        AND PL.PricingTypeId = APP.inPricingTypeId AND APP.btIsActive = 1
                                    WHERE   APP.inPricingTypeId IS NULL
                        END
                    ELSE
                        BEGIN
                            UPDATE TblTrn_AddonPricing_Prepaid
                                SET btIsActive = 0, 
                                inModifiedBy = @LoginUserId,
                                dtModifiedOn = GETDATE()
                                WHERE inAddonId = @AddonId AND btIsActive = 1
                        END
                END
            SELECT @AddonId [Id]
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