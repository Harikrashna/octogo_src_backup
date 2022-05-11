import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DependEditionDto, EditionServiceProxy, ModuleDto, PageModulesDto, SubModuleListDto, SubModulesDto, SubSubModuleListDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edition-modules',
  templateUrl: './edition-modules.component.html',
  styleUrls: ['./edition-modules.component.css']
})
export class EditionModulesComponent extends AppComponentBase implements OnInit {
  
  @Input() DependEditionData: DependEditionDto[];  //DependEditionDto
  @Input() ForTenantPage: boolean = false
  SelectedIndex: number = -1;
  SelectedModule: PageModulesDto;
  IsScrollable: boolean = false;
  CanScrollLeft: boolean = false;
  CanScrollRight: boolean = false;
  SubModuleList: SubModuleListDto[] = [];
  SubSubModuleList: SubSubModuleListDto[] = [];
  PageModuleList: PageModulesDto[];
  ActualPageModuleList: PageModulesDto[] = [];
  PageSubModuleList: SubModulesDto[];
  ActualPageSubModuleList: SubModulesDto[];
  IsDependentEditionModuleSelected: boolean = false;
  scrollLength = 500;
  SelectedDependentEdition = null;
  ModuleDataFetched:boolean = false;
  constructor(injector: Injector, private _editionService: EditionServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {

  }
  // this method calls in create mode only
  GetModuleList(productId, IsDependent = false) {
    this.PageModuleList = [];
    this.PageSubModuleList = [];
    this.ActualPageModuleList = [];
    this.ActualPageSubModuleList = [];
    if (productId != null && productId > 0) {
      this.ModuleDataFetched = false;
      this._editionService.getModuleList(productId).subscribe(result => {
        this.ModuleDataFetched = true;
        if (result != null) {
          this.PageModuleList = result.moduleList;
          this.ActualPageModuleList.push(...this.PageModuleList);
          this.PageSubModuleList = result.subModuleList;
          this.ActualPageSubModuleList.push(...this.PageSubModuleList);
          if (IsDependent) {
            this.SetDependentEditionModules();
          }
          this.CheckScrollable();
        }
      });
    }
  }
  // this method calls in edit mode only
  SetModuleDataForEdit(moduleData: ModuleDto[], productId) {
    this.PageModuleList = [];
    this.PageSubModuleList = [];
    this.ActualPageModuleList = [];
    this.ActualPageSubModuleList = [];
    this.ModuleDataFetched = false;
    this._editionService.getModuleList(productId).subscribe(async result => {
      this.ModuleDataFetched = true;
      if (result != null) {
        this.PageModuleList = result.moduleList;
        
        this.PageSubModuleList = result.subModuleList;
        this.ActualPageModuleList.push(...this.PageModuleList);
        this.ActualPageSubModuleList.push(...this.PageSubModuleList);
        // await this.RemoveDependentEditionModules();
        await this.SetDependentEditionModules(true);
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
            else {
              // Remove module selection if all sub modules are un-selected
              let moduleIndex = this.PageModuleList.findIndex(x => x.id == ediModule.pageModuleId)
              this.PageModuleList[moduleIndex]["selected"] = false;
            }
          })
        }
        this.CheckScrollable();
      }
    });
  }

  async SetDependentEditionModules(forEdit = false) {
    if (this.PageModuleList != null && this.PageModuleList.length > 0) {
      if (this.DependEditionData != null && this.DependEditionData != undefined && this.DependEditionData.length > 0) {
        this.DependEditionData.forEach(depEdition => // Iterate dependent Edition
        {
          depEdition.moduleData.forEach(depModule => {
            let moduleIndex = this.PageModuleList.findIndex(x => x.id == depModule.pageModuleId);
            if (moduleIndex != -1) {
              // set DepEdition Name on Module
              if (this.PageModuleList[moduleIndex]["DepEditionName"] == null || this.PageModuleList[moduleIndex]["DepEditionName"] == undefined) {
                this.PageModuleList[moduleIndex]["DepEditionName"] = depEdition.displayName;
              }
              else {
                this.PageModuleList[moduleIndex]["DepEditionName"] = this.PageModuleList[moduleIndex]["DepEditionName"] + " | " + depEdition.displayName;
              }
              // set DepEditionSubModules data
              let subModuleListIndex = this.PageSubModuleList.findIndex(x => x.moduleId == depModule.pageModuleId);
              if (subModuleListIndex != -1) {
                depModule.subModuleList.forEach(depSubModule => {
                  let subModuleIndex = this.PageSubModuleList[subModuleListIndex].subModuleList.findIndex(x => x.id == depSubModule.pageModuleId);
                  if (subModuleIndex != -1) {
                    this.PageSubModuleList[subModuleListIndex].subModuleList[subModuleIndex]["selected"] = true;
                    this.PageSubModuleList[subModuleListIndex].subModuleList[subModuleIndex]["dependent"] = true;
                    // set DepSubSubModules Data
                    if (depSubModule.subModuleList != null && depSubModule.subModuleList != undefined && depSubModule.subModuleList.length > 0) {
                      depSubModule.subModuleList.forEach(depSubSubModule => {
                        let subSubModuleIndex = this.PageSubModuleList[subModuleListIndex].subModuleList[subModuleIndex].subSubModuleList.findIndex(x => x.id == depSubSubModule.pageModuleId);
                        if (subSubModuleIndex != -1) {
                          this.PageSubModuleList[subModuleListIndex].subModuleList[subModuleIndex].subSubModuleList[subSubModuleIndex]["selected"] = true;
                          this.PageSubModuleList[subModuleListIndex].subModuleList[subModuleIndex].subSubModuleList[subSubModuleIndex]["dependent"] = true;
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        });
      }
    }
  }
  // async RemoveDependentEditionModules(forEdit = true) {
  //   if(this.PageModuleList != null && this.PageModuleList.length > 0)
  //   {
  //   if (!forEdit) {
  //     this.ResetModuleList();
  //   }
  //   if (this.DependEditionData != null && this.DependEditionData != undefined && this.DependEditionData.length > 0) {
  //     this.DependEditionData.forEach(depEdition => {  // Iterate dependent Edition
  //       if(depEdition.moduleData != null && depEdition.moduleData.length > 0){
  //         depEdition.moduleData.forEach(depModule =>    // Iterate dependent edition modules
  //           {
  //             if(depModule.subModuleList != null && depModule.subModuleList.length > 0) // if subModules exist in Dependent module
  //             {
  //               let moduleIndex = this.PageModuleList.findIndex( x => x.id == depModule.pageModuleId); 
  //               if(moduleIndex >= 0)      // if Module exist in Dependent Modules list
  //               {   
  //                 let subModuleListIndex = this.PageSubModuleList.findIndex(x => x.moduleId == depModule.pageModuleId);
  //                 if(subModuleListIndex >= 0) // index of SubModule list for dependent module
  //                 {
  //                   depModule.subModuleList.forEach(depSubModule =>       //  Iterate dependent edition Sub Modules
  //                     {
  //                       // find dependent edition submodule in Submodule list
  //                       let subModuleIndex = this.PageSubModuleList[subModuleListIndex].subModuleList.findIndex(x => x.id == depSubModule.pageModuleId);
  //                       if(subModuleIndex >= 0)   // if dependent edtion submodule exist in submdule list
  //                       {
  //                         if(depSubModule.subModuleList != null && depSubModule.subModuleList.length > 0)
  //                         {
  //                           // if dependent edition submodule having subSubmodules
  //                           depSubModule.subModuleList.forEach(depSubSubModule =>   // Iterate dependent edition Sub Sub Modules
  //                             {
  //                               // find Sub Sub module Index
  //                               let subSubModuleIndex = this.PageSubModuleList[subModuleListIndex].subModuleList[subModuleIndex].subSubModuleList.findIndex(x => x.id == depSubSubModule.pageModuleId);
  //                               if(subSubModuleIndex >= 0)  //  if dependent edtion sub sub module exist in sub sub mdule list
  //                               {
  //                                 // Remove sub sub Module from Sub Sub Module list
  //                                 this.PageSubModuleList[subModuleListIndex].subModuleList[subModuleIndex].subSubModuleList.splice(subSubModuleIndex, 1);
  //                               }
  //                             })
  //                         }
  //                         else
  //                         {
  //                           // if dependent edition submodule don't having subSubmodules
  //                           // Remove subModule from SubModule list
  //                           this.PageSubModuleList[subModuleListIndex].subModuleList.splice(subModuleIndex, 1);
  //                         }
  //                       }
  //                     });
  //                 }
  //             }
  //             }
  //           });
  //       }
  //     });

  //     // Remove submodules whose all sub-sub modules removed for dependent edition modules
  //     this.ActualPageSubModuleList.forEach(module =>
  //       {
  //         let subModuleListIndex = this.PageSubModuleList.findIndex(x => x.moduleId == module.moduleId);
  //         if(subModuleListIndex >= 0 && module.subModuleList != null && module.subModuleList.length > 0)
  //         {
  //           // module.subModuleList.forEach(subModule =>
  //             // {
  //               // if(subModule.subSubModuleList != null && subModule.subSubModuleList != undefined){
  //                 let tempSubModules = this.PageSubModuleList[subModuleListIndex].subModuleList.filter(x => (x.subSubModuleList == null || x.subSubModuleList == undefined || x.subSubModuleList.length == 0));
  //                 if(tempSubModules != null && tempSubModules != undefined && tempSubModules.length > 0)
  //                 {
  //                   tempSubModules.forEach(sModule => 
  //                     {
  //                       let tempSubModuleIndex = this.PageSubModuleList[subModuleListIndex].subModuleList.findIndex(x => x.id == sModule.id);
  //                       if(tempSubModuleIndex >= 0)
  //                       {
  //                         this.PageSubModuleList[subModuleListIndex].subModuleList.splice(tempSubModuleIndex, 1);
  //                       }
  //                     })
  //                 }
  //               // }
  //             // });
  //           // Remove modules whose all sub modules removed for dependent edition modules
  //           if(this.PageSubModuleList[subModuleListIndex].subModuleList == null || this.PageSubModuleList[subModuleListIndex].subModuleList.length == 0)
  //           {
  //             let moduleListIndex = this.PageModuleList.findIndex(x => x.id == this.PageSubModuleList[subModuleListIndex].moduleId);
  //             if(moduleListIndex >= 0)
  //             {
  //               this.PageModuleList.splice(moduleListIndex, 1);
  //             }
  //             this.PageSubModuleList.splice(subModuleListIndex, 1);
  //           }
  //         }
  //       })
  //   }
  // }
  // }
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
        if (this.PageModuleList != null && this.PageModuleList.length > 0) {
          let firstSelectedIndex = this.PageModuleList.findIndex(obj => obj["selected"] == true || obj["DepEditionName"] != null);
          if (firstSelectedIndex >= 0) {
            this.SelectModule(this.PageModuleList[firstSelectedIndex], firstSelectedIndex);
            this.CanScrollLeft = firstSelectedIndex > 1 ? true : false;
            ele.scrollLeft += this.scrollLength * firstSelectedIndex / 4;
          }
        }
        if (ele.clientWidth > 0) {
          clearInterval(timer);
        }
      }
    }, 50)
  }
  SelectDependentEditionModule(module, editionName) {
    this.SelectedDependentEdition = editionName;
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
            if (subModule["subSubModules"] != null && subModule["subSubModules"] != undefined && subModule["subSubModules"].length > 0) {
              subModule["subSubModules"].forEach(obj => {
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
  SelectModuleForTenant(module, index) {
    this.IsDependentEditionModuleSelected = false;
    this.SubSubModuleList = [];
    this.SubModuleList = [];
      this.SelectedIndex = index;
      this.SelectedModule = module;
    let subModule = this.PageSubModuleList.filter(obj => obj.moduleId == module.id);
    if (subModule != null && subModule != undefined && subModule.length > 0) {
      
      this.SubModuleList = subModule[0].subModuleList;
      this.SubSubModuleList = [];
    }
  }
  SelectModule(module, index, isReset: boolean = false) {
    this.SelectedDependentEdition = null;
    if (this.SelectedIndex >= 0 && this.SelectedIndex != index) {
      if (!this.SubModuleList) {
        this.SelectModuleAction(module, index, true, true);
      }
      else {
        let moduleChangeConfirmation = false;
        let selectedSubModule = this.SubModuleList.filter(obj => obj["selected"] == true && !obj["dependent"]);
        let selectedDepSubModule = this.SubModuleList.filter(obj => obj["selected"] == true && obj["dependent"]);
        if (selectedSubModule != null && selectedSubModule != undefined && selectedSubModule.length > 0) {
          let flag = 0;
          selectedSubModule.forEach(subModule => {
            if (subModule["selected"] == true) {
              if (flag == 0) moduleChangeConfirmation = false;
            if (subModule.subSubModuleList != null && subModule.subSubModuleList != undefined) {
              let selectedSubSubModIndex = subModule.subSubModuleList.findIndex(x => x["selected"] == true && !x["dependent"]);
              if (selectedSubSubModIndex < 0) {
                moduleChangeConfirmation = true;
                flag++;
              }
            }
          }
          })
        }
        else if (selectedDepSubModule != null && selectedDepSubModule != undefined && selectedDepSubModule.length > 0) {
          let flag = 0;
          selectedDepSubModule.forEach(subModule => {
            if (subModule["selected"] == true) {
              if (flag == 0) moduleChangeConfirmation = false;
              if (subModule.subSubModuleList != null && subModule.subSubModuleList != undefined) {
                let selectedSubSubModIndex = subModule.subSubModuleList.findIndex(x => x["selected"] == true && !x["dependent"]);
                if (selectedSubSubModIndex < 0) {
                  moduleChangeConfirmation = true;
                  flag++;
                }
              }
            }
          })
        }
        else {
          moduleChangeConfirmation = true;
        }
        // this condition only checked when modules manage on Tenant creation page
        if(this.ForTenantPage == true){ 
          moduleChangeConfirmation = false; 
          let selectedSubModule = this.SubModuleList.filter(obj => obj["selected"] == true);
          if (selectedSubModule != null && selectedSubModule != undefined && selectedSubModule.length > 0) {
            let flag = 0;
            selectedSubModule.forEach(subModule => {
              if (subModule["selected"] == true) {
                if (flag == 0) moduleChangeConfirmation = false;
              if (subModule.subSubModuleList != null && subModule.subSubModuleList != undefined) {
                let selectedSubSubModIndex = subModule.subSubModuleList.findIndex(x => x["selected"] == true);
                if (selectedSubSubModIndex < 0) {
                  moduleChangeConfirmation = true;
                  flag++;
                }
              }
            }
            })
          }
          else{
            moduleChangeConfirmation = true;
          }
        }
        if(this.ForTenantPage == false){
        if (moduleChangeConfirmation == true) {
          this.message.confirm(
            this.l('EditionModuleChangeConfirmationMsg', this.SelectedModule.displayName),
            this.l('AreYouSure'),
            isConfirmed => {
              if (isConfirmed) {
                this.SelectModuleAction(module, index, true, true);
              }
              else {
                return;
              }
            }
          );
        }
        else {
          this.SelectModuleAction(module, index, isReset);
        }
      }
      }
    }
    else {
      this.SelectModuleAction(module, index, isReset);
    }
  }
  async SelectModuleAction(module, index, isReset: boolean = false, isConfirmed = false) {
    
    this.IsDependentEditionModuleSelected = false;
    this.SubSubModuleList = [];
    this.SubModuleList = [];
    if (!isConfirmed) {
      
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
                if (!subMod["dependent"]) subMod["selected"] = false;
                
                if (subMod.subSubModuleList != null && subMod.subSubModuleList != undefined) {
                  subMod.subSubModuleList.forEach(subSubMod => {        // reset Sub Sub Module selection
                    if (!subSubMod["dependent"]) subSubMod["selected"] = false;
                    
                  });
                }
              });
            }
            
          }
        });
      }
      this.SelectedModule = null;
      this.SelectedIndex = -1;
      if (isConfirmed) {  // when user confirm YES while module selection change without selct any sub-module
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
            if (obj2.subSubModuleList != null && obj2.subSubModuleList != undefined && obj2.subSubModuleList.length > 0) {
              obj2.subSubModuleList.forEach(x => {
                
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
          if (obj.subModuleList[subIndex].subSubModuleList != null && obj.subModuleList[subIndex].subSubModuleList != undefined) {
            obj.subModuleList[subIndex].subSubModuleList.forEach(x => {
              if (!x["dependent"]) x["selected"] = false;
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
            if (obj2.subSubModuleList != null && obj2.subSubModuleList != undefined && obj2.subSubModuleList.length > 0) {
              obj2.subSubModuleList.forEach(subSubModule => {
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
              if (subSubIndex >= 0) {
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
