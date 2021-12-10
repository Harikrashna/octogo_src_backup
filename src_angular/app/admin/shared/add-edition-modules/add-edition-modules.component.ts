/*
  Created On : 21 Oct 2021
  Desc : To add Modules(Features) and Sub-modules
*/

import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EditionModule } from '@app/admin/shared-models/Edition/EditionModule';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DependEditionDto, EditionServiceProxy, PageModulesDto, SubModulesDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-add-edition-modules',
  templateUrl: './add-edition-modules.component.html',
  styleUrls: ['./add-edition-modules.component.css']
})
export class AddEditionModulesComponent extends AppComponentBase implements OnInit {
  @ViewChild('editionModuleForm') editionModuleForm: NgForm;

  @Input() ModulesList: EditionModule[];
  @Input() DependEditionData: any[];
  // ModuleName: string;
  isModuleEdit: boolean = false;
  isSubModuleEdit: boolean = false;
  selectedModuleIndex = null;
  PageModuleList: PageModulesDto[];
  PageSubModuleList: SubModulesDto[];
  filteredPageModuleList: PageModulesDto[];
  Module: PageModulesDto;

  constructor(injector: Injector, private _editionService: EditionServiceProxy,) {
    super(injector)
    this.ModulesList = new Array<EditionModule>();
    this.Module = new PageModulesDto();
  }

  ngOnInit(): void {
    this.GetModuleList();
  }
  // get Page Module list
  GetModuleList() {
    this.PageModuleList = [];
    this.PageSubModuleList = [];
    this._editionService.getModuleList().subscribe(result => {
      if (result != null) {
        this.PageModuleList = result.moduleList;
        this.PageSubModuleList = result.subModuleList;
      }
    });
  }

  searchModule(event) {
    let filtered: any[] = [];
    let query = event.query.trim();
    for (let i = 0; i < this.PageModuleList.length; i++) {
      let module = this.PageModuleList[i];
      if (module.displayName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(module);
      }
    }

    this.filteredPageModuleList = filtered;
  }
  searchSubModule(event, ParentModuleId, i) {
    let filtered: any[] = [];
    let query = event.query.trim();
    let SubModule = this.PageSubModuleList.filter(obj => obj.moduleId == ParentModuleId);
    if (query != null && query != undefined && SubModule != null && SubModule != undefined && SubModule.length > 0) {
      for (let i = 0; i < SubModule[0].subModuleList.length; i++) {
        let module = SubModule[0].subModuleList[i];
        if (module.displayName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(module);
        }
      }
    }
    this.ModulesList[i].filteredSubModuleList = filtered;
  }
  // To Add default Module/Feature
  AddModule() {
    if (this.checkDuplicateDependEditionModule()) {
      this.notify.warn(this.l('DuplicateRecord'));
      return false;
    }
    if ((this.ModulesList.findIndex(x => x.ModuleName.toLocaleUpperCase() === this.Module.displayName.toLocaleUpperCase()) < 0)
      || (this.isModuleEdit && this.ModulesList.findIndex(x => x.ModuleName.toLocaleUpperCase() === this.Module.displayName.toLocaleUpperCase()) == this.selectedModuleIndex)) {
      if (this.isModuleEdit) {
        this.ModulesList[this.selectedModuleIndex].ModuleName = this.Module.displayName;
        this.ModulesList[this.selectedModuleIndex].PageModuleId = this.Module.id;
        this.ModulesList[this.selectedModuleIndex].SubModuleList = [];
      }
      else {
        this.ModulesList.push(
          {
            EditionModuleId: 0,
            ModuleName: this.Module.displayName,
            SubModuleList: [],
            Collapse: false,
            PageModuleId: this.Module.id
          }
        )
      }
      this.Module = new PageModulesDto();
      this.isModuleEdit = false;
      this.selectedModuleIndex = null;
    }
    else {
      this.notify.warn(this.l('DuplicateRecord'));
    }
  }
  checkDuplicateDependEditionModule(): boolean {
    let flag: boolean = false;
    if (this.DependEditionData != null && this.DependEditionData != undefined) {
      this.DependEditionData.forEach(obj => {
        if (obj.moduleData.findIndex(x => x.moduleName.toLocaleUpperCase() === this.Module.displayName.toLocaleUpperCase()) >= 0) {
          flag = true;
        }
      })
    }
    return flag;
  }
  DispAddSubModule(ParentIndex) {
    this.ModulesList[ParentIndex].CanAddSubModule = true;
    setTimeout(() => {
      document.getElementById("SubModuleDisplayName" + ParentIndex.toString()).focus();
    }, 300);
  }
  // To Add Sub-module of default Module/Feature
  AddSubModule(ParentIndex) {
    if (this.ModulesList[ParentIndex].SubModuleList.findIndex(x => x.ModuleName.toLocaleUpperCase() === this.ModulesList[ParentIndex].SubModule.displayName.toLocaleUpperCase()) < 0) {
      if (this.ModulesList[ParentIndex].selectedSubModuleIndex != undefined && this.ModulesList[ParentIndex].selectedSubModuleIndex != null && this.isSubModuleEdit) {
        this.ModulesList[ParentIndex].SubModuleList[this.ModulesList[ParentIndex].selectedSubModuleIndex].SubModule = this.ModulesList[ParentIndex].SubModule;
        this.ModulesList[ParentIndex].SubModuleList[this.ModulesList[ParentIndex].selectedSubModuleIndex].ModuleName = this.ModulesList[ParentIndex].SubModule.displayName;
        this.ModulesList[ParentIndex].SubModuleList[this.ModulesList[ParentIndex].selectedSubModuleIndex].PageModuleId = this.ModulesList[ParentIndex].SubModule.id;
      }
      else {
        this.ModulesList[ParentIndex].SubModuleList.push(
          {
            EditionModuleId: 0,
            ModuleName: this.ModulesList[ParentIndex].SubModule.displayName,
            PageModuleId: this.ModulesList[ParentIndex].SubModule.id
          }
        );
      }
      this.ModulesList[ParentIndex].Collapse = false;
      this.ModulesList[ParentIndex].SubModule = new PageModulesDto();
      this.ModulesList[ParentIndex].CanAddSubModule = false;
      this.ModulesList[ParentIndex].selectedSubModuleIndex = null;
      this.isSubModuleEdit = false;
    }
    else {
      this.notify.warn(this.l('DuplicateRecord'));
    }
  }
  RemoveModule(index) {
    this.ModulesList.splice(index, 1);
    this.Module = new PageModulesDto();
  }
  EditModule(index) {
    this.isModuleEdit = true;
    this.selectedModuleIndex = index;
    this.Module = new PageModulesDto();
    let tempModule = this.PageModuleList.filter(obj => obj.id == this.ModulesList[index].PageModuleId);
    if (tempModule != null && tempModule != undefined && tempModule.length > 0) {
      this.Module = tempModule[0];
    }
  }
  RemoveSubModule(parentIndex, index) {
    this.ModulesList[parentIndex].SubModuleList.splice(index, 1);
  }
  EditSubModule(parentIndex, index) {
    this.isSubModuleEdit = true;
    this.ModulesList[parentIndex].CanAddSubModule = true;
    this.ModulesList[parentIndex].selectedSubModuleIndex = index;
    this.ModulesList[parentIndex].SubModule = new PageModulesDto();
    let tempModule = this.PageSubModuleList.filter(obj => obj.moduleId == this.ModulesList[parentIndex].PageModuleId);
    if (tempModule != null && tempModule != undefined && tempModule.length > 0) {
      let tempSubModule = tempModule[0].subModuleList.filter(obj => obj.id == this.ModulesList[parentIndex].SubModuleList[index].PageModuleId);
      if (tempSubModule != null && tempSubModule != undefined && tempSubModule.length > 0) {
        this.ModulesList[parentIndex].SubModule = tempSubModule[0];
      }
    }
  }
  CollapseList(i) {
    this.ModulesList[i].Collapse = !this.ModulesList[i].Collapse;
  }
  CollapseDependEdition(editionIndex, moduleIndex?) {
    if (moduleIndex != null && moduleIndex != undefined) {
      this.DependEditionData[editionIndex].moduleData[moduleIndex].Collapse = !this.DependEditionData[editionIndex].moduleData[moduleIndex].Collapse;
    }
    else {
      this.DependEditionData[editionIndex].Collapse = !this.DependEditionData[editionIndex].Collapse;
    }
  }
}


