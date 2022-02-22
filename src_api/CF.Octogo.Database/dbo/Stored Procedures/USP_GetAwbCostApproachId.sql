
/*
    CREATED ON : 24/11/2021
    CREATE BY : Deepak
    DESC : 
    DRY RUN: 
    USP_GetAwbCostApproachId 1
*/
CREATE procedure [dbo].[USP_GetAwbCostApproachId] 
    @AwbCostApproachId INT 
AS   
BEGIN
    Select inApproachID, vcApproachName , vcDescription 
        FROM TblMst_PerAWBCostApproach 
        WHERE inApproachID = @AwbCostApproachId
End    