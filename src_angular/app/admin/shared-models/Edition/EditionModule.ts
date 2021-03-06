import { PageModulesDto, SubModuleListDto } from "@shared/service-proxies/service-proxies";

export class EditionModule{
    EditionModuleId? : number;
    ModuleName : string;
    SubModuleList? : EditionModule[];
    CanAddSubModule? : boolean;
    SubModule? : SubModuleListDto;
    Collapse?:boolean;
    selectedSubModuleIndex?;
    PageModuleId? :number;
    filteredSubModuleList? : any[];
    constructor() {
      this.SubModuleList = new Array<EditionModule>();
      this.CanAddSubModule = false;
      this.Collapse = true;
     }
  }