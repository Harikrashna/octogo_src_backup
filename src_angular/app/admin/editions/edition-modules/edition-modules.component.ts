import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DependEditionDto, EditionServiceProxy, ModuleDto, PageModulesDto, SubModuleListDto, SubModulesDto, SubSubModuleListDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edition-modules',
  templateUrl: './edition-modules.component.html',
  styleUrls: ['./edition-modules.component.css']
})
export class EditionModulesComponent extends AppComponentBase implements OnInit {

  @Input() DependEditionData: any[];
  SelectedIndex: number = -1;
  SelectedModule: PageModulesDto;
  IsScrollable: boolean = false;
  CanScrollLeft: boolean = false;
  CanScrollRight: boolean = false;
  SubModuleList: SubModuleListDto[] = [];
  SubSubModuleList: SubSubModuleListDto[] = [];
  PageModuleList: PageModulesDto[];
  TempPageModuleList: PageModulesDto[] = [];
  PageSubModuleList: SubModulesDto[];
  IsDependentEditionModuleSelected: boolean = false;
  scrollLength = 500;

  constructor(injector: Injector, private _editionService: EditionServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    localStorage.setItem('dataSource', "this.dataSource.length");
  }
  // this method calls in create mode only
  GetModuleList() {
    this.PageModuleList = [];
    this.PageSubModuleList = [];
    this.TempPageModuleList = new Array<PageModulesDto>();
    this._editionService.getModuleList().subscribe(result => {
      if (result != null) {
        this.PageModuleList = result.moduleList;
        this.TempPageModuleList = this.PageModuleList;
        this.PageSubModuleList = result.subModuleList;
        this.CheckScrollable();
      }
    });
  }
  // this method calls in edit mode only
  SetModuleDataForEdit(moduleData: ModuleDto[]) {
    this.PageModuleList = [];
    this.PageSubModuleList = [];
    this._editionService.getModuleList().subscribe(result => {
      if (result != null) {
        this.PageModuleList = result.moduleList;
        this.PageSubModuleList = result.subModuleList;
        this.RemoveDependentEditionModules();
        if (moduleData != null && moduleData != undefined && moduleData.length > 0) {
          moduleData.forEach(ediModule => {
            // set module selection
            if (this.PageModuleList != null && this.PageModuleList != undefined && this.PageModuleList.length > 0) {
              for (let i = 0; i < this.PageModuleList.length; i++) {
                if (ediModule.pageModuleId == this.PageModuleList[i].id) {
                  this.PageModuleList[i]["selected"] = true;
                  this.PageModuleList[i]["editionModuleId"] = ediModule.moduleId;
                  break;
                }
              }
            }
            // set sub module selection
            if (ediModule.subModuleList != null && ediModule.subModuleList != undefined && ediModule.subModuleList.length > 0) {
              ediModule.subModuleList.forEach(ediSubModule => {
                let subModuleIndex = this.PageSubModuleList.findIndex(obj => obj.moduleId == ediModule.pageModuleId)
                if (subModuleIndex >= 0 && this.PageSubModuleList[subModuleIndex].subModuleList != null && this.PageSubModuleList[subModuleIndex].subModuleList.length > 0) {
                  for (let i = 0; i < this.PageSubModuleList[subModuleIndex].subModuleList.length; i++) {
                    if (ediSubModule.pageModuleId == this.PageSubModuleList[subModuleIndex].subModuleList[i].id) {
                      this.PageSubModuleList[subModuleIndex].subModuleList[i]["selected"] = true;
                      this.PageSubModuleList[subModuleIndex].subModuleList[i]["subModuleId"] = ediSubModule.subModuleId;

                      // set sub sub module selection
                      if (this.PageSubModuleList[subModuleIndex].subModuleList[i].subSubModuleList != null
                        && this.PageSubModuleList[subModuleIndex].subModuleList[i].subSubModuleList.length > 0
                        && ediSubModule.subModuleList != null && ediSubModule.subModuleList.length > 0) {
                        ediSubModule.subModuleList.forEach(subSubModule => {
                          for (let j = 0; j < this.PageSubModuleList[subModuleIndex].subModuleList[i].subSubModuleList.length; j++) {
                            if (subSubModule.pageModuleId == this.PageSubModuleList[subModuleIndex].subModuleList[i].subSubModuleList[j].id) {
                              this.PageSubModuleList[subModuleIndex].subModuleList[i].subSubModuleList[j]["selected"] = true;
                              this.PageSubModuleList[subModuleIndex].subModuleList[i].subSubModuleList[j]["subModuleId"] = subSubModule.subModuleId;
                            }
                          }
                        })
                      }
                      break;
                    }
                  }
                }
              });
            }
          })
        }
        this.CheckScrollable();
      }
    });
  }
  RemoveDependentEditionModules(forEdit = true) {
    if(!forEdit){
      this.PageModuleList = this.TempPageModuleList;
    }
    if (this.DependEditionData != null && this.DependEditionData.length > 0) {
      this.DependEditionData.forEach(edition => {
        if (edition.moduleData != null && edition.moduleData.length > 0) {
          edition.moduleData.forEach(element => {
            let moduleIndex = this.PageModuleList.findIndex(obj => obj.displayName.toLowerCase() == element.moduleName.toLowerCase())
            if (moduleIndex >= 0) {
              this.PageModuleList.splice(moduleIndex, 1);
            }
          });
        }
      })
    }
  }
  ScrollLeft() {
    let scroll = this.scrollLength;
    let ele = document.getElementById('module_content')
    ele.scrollLeft -= scroll;
    this.CanScrollRight = true;
    this.CanScrollLeft = ele.scrollLeft > 0;
  }
  ScrollRight() {
    let scroll = this.scrollLength;
    let ele = document.getElementById('module_content')
    this.CanScrollLeft = true;
    if ((ele.scrollWidth - ele.clientWidth) - ele.scrollLeft > scroll) {
      this.CanScrollRight = true;
    }
    else {
      this.CanScrollRight = false;
    }
    ele.scrollLeft += scroll;
  }
  CheckScrollable() {
    this.IsScrollable = false;
    this.CanScrollLeft = false;
    this.CanScrollRight = false;
    let timer = setInterval(() => {
      let ele = document.getElementById('module_content')
      if (ele != null && ele != undefined) {
        const hasScrollableContent = ele.scrollWidth > ele.clientWidth;
        this.IsScrollable = hasScrollableContent;
        
        this.CanScrollRight = this.IsScrollable;
        this.CanScrollLeft = false;
        // set auto selected in edit mode
        if(this.PageModuleList != null && this.PageModuleList.length > 0)
        {
            let firstSelectedIndex = this.PageModuleList.findIndex(obj => obj["selected"] == true);
            if(firstSelectedIndex >= 0)
            {
            this.SelectModule(this.PageModuleList[firstSelectedIndex], firstSelectedIndex);
            this.CanScrollLeft = firstSelectedIndex > 4 ? true :false;
            ele.scrollLeft += this.scrollLength * firstSelectedIndex/4;
            }
        }
        if (ele.clientWidth > 0) {
          clearInterval(timer);
        }
      }
    }, 50)
  }
  SelectDependentEditionModule(module, editionInx, index) {
    debugger
    this.IsDependentEditionModuleSelected = true;
    this.SubSubModuleList = [];
    this.SubModuleList = [];
    this.SelectedModule = new PageModulesDto();
    this.SelectedModule.displayName = module.moduleName;
    this.SelectedModule.id = module.moduleId;
    if (module.subModuleList != null && module.subModuleList != undefined) {
      module.subModuleList.forEach(element => {
        let subModule = new SubModuleListDto();
        subModule.id = element.subModuleId;
        subModule.displayName = element.moduleName != null ? element.moduleName : element.subModuleName;
        subModule["subSubModules"] = element.subModuleList;
        subModule["selected"] = true;
        this.SubModuleList.push(subModule);
        this.SubSubModuleList = [];
        if (this.SubModuleList != null && this.SubModuleList != undefined) {
          this.SubModuleList.forEach(subModule => {
            if(subModule["subSubModules"] != null && subModule["subSubModules"] != undefined && subModule["subSubModules"].length > 0){
              subModule["subSubModules"].forEach(obj =>{
                let subSubModule = new SubSubModuleListDto();
                subSubModule.id = obj.subModuleId;
                subSubModule.displayName = obj.moduleName;
                subSubModule["selected"] = true;
                this.SubSubModuleList.push(subSubModule);
              })
            }
          });
        }
      });
    }
    this.SelectedIndex = -1;
  }

  SelectModule(module, index, isReset: boolean = false) {
    if (this.SelectedIndex >= 0 && this.SelectedIndex != index) {
      if (!this.SubModuleList) {
        this.SelectModuleAction(module, index, true, true);
      }
      else {
        let moduleChangeConfirmation = false;
        let selectedSubModule = this.SubModuleList.filter(obj => obj["selected"] == true);
        if (selectedSubModule != null && selectedSubModule != undefined && selectedSubModule.length > 0){
          selectedSubModule.forEach(subModule =>{
            if(subModule.subSubModuleList != null && subModule.subSubModuleList != undefined){
              let selectedSubSubModIndex = subModule.subSubModuleList.findIndex(x => x["selected"] == true);
              if(selectedSubSubModIndex < 0){
                moduleChangeConfirmation = true;
              }
            }
          })
        }
        else {
          moduleChangeConfirmation = true;
        }
        if(moduleChangeConfirmation == true){
          this.message.confirm(
            this.l('EditionModuleChangeConfirmationMsg', this.SelectedModule.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
              if(isConfirmed){
                this.SelectModuleAction(module, index, true, true);
              }
              else{
                return;
              }
            }
          );
        }
        else{
          this.SelectModuleAction(module, index, isReset);
        }
      }
    }
    else{
      this.SelectModuleAction(module, index, isReset);
    }
  }
  async SelectModuleAction(module, index, isReset: boolean = false, isConfirmed = false) {
      this.IsDependentEditionModuleSelected = false;
      this.SubSubModuleList = [];
      this.SubModuleList = [];
      if(!isConfirmed){
        this.SelectedIndex = index;
        this.SelectedModule = module;
      }
      if (isReset == true) {
        // reset module selection
        this.PageModuleList[this.SelectedIndex]["selected"] = false;       // reset module selection
        if (this.PageSubModuleList != null && this.PageSubModuleList != undefined) {
          this.PageSubModuleList.forEach(mod => {
            if (this.SelectedModule != null && mod.moduleId == this.SelectedModule.id) {
              if (mod.subModuleList != null && mod.subModuleList != undefined) {
                mod.subModuleList.forEach(subMod => {        // reset Sub Module selection
                  subMod["selected"] = false;
                  if (subMod.subSubModuleList != null && subMod.subSubModuleList != undefined) {
                    subMod.subSubModuleList.forEach(subSubMod => {        // reset Sub Sub Module selection
                      subSubMod["selected"] = false;
                    });
                  }
                });
              }
            }
          });
        }
        this.SelectedModule = null;
        this.SelectedIndex = -1;
        if(isConfirmed){  // when user confirm YES while module selection change without selct any sub-module
          this.SelectModuleAction(module, index, false);
        }
      }
      else {
        this.PageModuleList[this.SelectedIndex]["selected"] = true;
        let subModule = this.PageSubModuleList.filter(obj => obj.moduleId == module.id);
        if (subModule != null && subModule != undefined && subModule.length > 0) {
          this.SubModuleList = subModule[0].subModuleList;
          this.SubSubModuleList = [];
          let selectedSubModules = this.SubModuleList.filter(obj => obj["selected"] == true);
          if (selectedSubModules != null && selectedSubModules != undefined) {
            selectedSubModules.forEach(obj2 => {
              if(obj2.subSubModuleList != null && obj2.subSubModuleList != undefined && obj2.subSubModuleList.length > 0){
                obj2.subSubModuleList.forEach(x =>{
                  this.SubSubModuleList.push(x);
                })
              }
            });
          }
        }
      }
  }
  SelectSubModule(subIndex) {
    this.PageSubModuleList.forEach(obj => {
      if (obj.moduleId == this.SelectedModule.id) {
        if (obj.subModuleList[subIndex]["selected"]) {
          obj.subModuleList[subIndex]["selected"] = false;
          if(obj.subModuleList[subIndex].subSubModuleList != null && obj.subModuleList[subIndex].subSubModuleList != undefined)
          {
            obj.subModuleList[subIndex].subSubModuleList.forEach(x =>{
              x["selected"] = false;
            })
          }
        }
        else {
          obj.subModuleList[subIndex]["selected"] = true;
        }
        this.SubSubModuleList = [];
        let selectedSubModules = obj.subModuleList.filter(obj1 => obj1["selected"] == true);
        if (selectedSubModules != null && selectedSubModules != undefined) {
          selectedSubModules.forEach(obj2 => {
            if(obj2.subSubModuleList != null && obj2.subSubModuleList != undefined && obj2.subSubModuleList.length > 0){
              obj2.subSubModuleList.forEach(subSubModule =>{
                this.SubSubModuleList.push(subSubModule);
              })
            }
          });
        }
      }
    })
  }
  SelectSubSubModule(subSubModuleId) {
    this.PageSubModuleList.forEach(mod => {
      if (mod.moduleId == this.SelectedModule.id) {
        if (mod.subModuleList != null && mod.subModuleList != undefined) {
          mod.subModuleList.forEach(subMod => {
            if (subMod.subSubModuleList != null && subMod.subSubModuleList != undefined) {
              let subSubIndex = subMod.subSubModuleList.findIndex(x => x.id == subSubModuleId);
              if(subSubIndex >= 0){
                if (subMod.subSubModuleList[subSubIndex]["selected"]) {
                  subMod.subSubModuleList[subSubIndex]["selected"] = false;
                }
                else {
                  subMod.subSubModuleList[subSubIndex]["selected"] = true;
                }
              }
            }
          });
        }
      }
    });

  }
}
