/*
    CREATED ON : 24/11/2021
    CREATE BY : Merajuddin Khan
    DESC : 
    DRY RUN: 
    USP_GetPricingApproachDuplicacyCheck @ApproachName = 'ds'
*/

CREATE PROCEDURE [dbo].[USP_GetPricingApproachDuplicacyCheck]
(
    @ApproachName varchar(100),
	@ApproachId INT = NULL
  
)

AS
    BEGIN
        SELECT  E.vcApproachName [ApproachName], E.vcDescription [Description]
            FROM TblMst_PricingApproach E (NOLOCK)
            WHERE E.vcApproachName = @ApproachName
		        AND ISNULL(@ApproachId,0) <> E.inApproachID AND E.btIsActive = 1
    END
