	/*  
    CREATED ON : 12 Nov 2021  
    DESC :  This is for PerAWBCostApproach
    DRY RUN :   
                GetPerAWBCostApproach  
*/  


CREATE PROCEDURE GetPerAWBCostApproach
AS  
    BEGIN  
        SELECT inApproachID [Id], vcApproachName [ApproachName]  ,vcDescription [Description]  
            FROM TblMst_PerAWBCostApproach (NOLOCK)  
            WHERE btIsActive = 1  

    END