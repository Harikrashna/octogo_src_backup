import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationServiceService {

  constructor() { }
  NameValidation(e){
    
    if(e.keyCode==32  && e.target.value==""){
      return false    
    }
    if(e.target.value=="" && e.keyCode >= 48 && e.keyCode <= 57){
      return false    
    }
    else if(e.keyCode==32  && e.target.value[e.target.value.length-1]==" "){
      return false    
    }
    var keyCode = e.which ? e.which : e.keyCode

    var ret = ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || e.keyCode==32 || e.keyCode==124 ||
              (keyCode >= 48 && keyCode <= 57) || keyCode==45 || keyCode==47);
     return ret;
  }
}
