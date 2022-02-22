/*
*************************************************************************************
Procedure Name	:	USP_GetEditionListForAddon
Purpose		    :	Get Edition list for create addons
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   23/11/2021
Modified By (On):	Hari Krashna(10/01/2022)
Description		:	

*************************************************************************************
*/

CREATE PROCEDURE [Usp_GetEditionListForAddon]
(
    @ProductId INT
)
AS
    BEGIN
        BEGIN TRY
            SELECT DISTINCT E.Id, E.Name, E.DisplayName [DisplayName]
                FROM AbpEditions E(NOLOCK)
                INNER JOIN TblTrn_EditionDependancy ED(NOLOCK)
                    ON E.Id = ED.inDependantEditionId
                    AND E.IsDeleted = 0 AND ED.btIsActive = 1
                INNER JOIN TblTrn_ProductEditionMapping PEM(NOLOCK)
                    ON E.Id = PEM.inEditionId AND PEM.btIsActive = 1
                WHERE PEM.inProductId = @ProductId
        END TRY
	    BEGIN CATCH
	        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END

