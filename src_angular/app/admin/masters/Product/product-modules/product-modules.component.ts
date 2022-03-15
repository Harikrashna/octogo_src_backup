import { ProductServiceProxy, SubModulesDto, SubModuleListDto, SubSubModuleListDto, ModuleDto, PageModulesDto, ProductModulesDto } from '@shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditProductComponent } from '../create-or-edit-product/create-or-edit-product.component';


@Component({
  selector: 'app-product-modules',
  templateUrl: './product-modules.component.html',
  styleUrls: ['./product-modules.component.css']
})
export class ProductModulesComponent extends AppComponentBase implements OnInit {
  @ViewChild('createProduct') createProduct: CreateOrEditProductComponent;
  @Input() Product: any
  SelectedIndex: number = -1;
  SelectedModule: PageModulesDto;
  IsScrollable: boolean = false;
  CanScrollLeft: boolean = false;
  CanScrollRight: boolean = false;
  // PageModuleList: ProductPageModulesDto[];
  // SubModuleList: ProductSubModuleListDto[] = [];
  // PageSubModuleList: ProductSubModulesDto[];
  // TempProductModuleList: ProductPageModulesDto[] = [];
  scrollLength = 500;
  // SubSubModuleList: ProductSubSubModuleListDto[] = [];
  ModuleList : ProductModulesDto[]=[];
  
  isShown: boolean = false ; // hidden by default
  isSubShown : boolean = false ;
  modIndex = null;
  subIndex = null;
 
  constructor(injector: Injector, private _productService: ProductServiceProxy) {
    super(injector);
   }

  ngOnInit() {
    this.GetProductModuleList();
  }
  GetProductModuleList(){
    // this.PageModuleList = [];
    // this.PageSubModuleList = [];
    // this._productService.getProductModuleList().subscribe(result => {
    //   if (result != null) {
    //     this.PageModuleList = result.moduleList;
    //     this.PageSubModuleList = result.subModuleList;
    //     this.CheckScrollable();
    //     console.log(this.PageModuleList);
    //     console.log(this.PageSubModuleList);
        
    //   }
    // });
  }
  toggleShow(index, isExpend) {
    this.ModuleList[index]["expended"] = isExpend;
    }
    toggleSubShow(index,i, isExpend) {
     this.ModuleList[index].subModuleList[i]["expended"] = isExpend;
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
//   CheckScrollable() {
//     this.IsScrollable = false;
//     this.CanScrollLeft = false;
//     this.CanScrollRight = false;
//     let timer = setInterval(() => {
//       let ele = document.getElementById('module_content')
//       if (ele != null && ele != undefined) {
//         const hasScrollableContent = ele.scrollWidth > ele.clientWidth;
//         this.IsScrollable = hasScrollableContent;
        
//         this.CanScrollRight = this.IsScrollable;
//         this.CanScrollLeft = false;
//         if(this.PageModuleList != null && this.PageModuleList.length > 0)
//         {
//             let firstSelectedIndex = this.PageModuleList.findIndex(obj => obj["selected"] == true);
//             if(firstSelectedIndex >= 0)
//             {
//             this.SelectModule(this.PageModuleList[firstSelectedIndex], firstSelectedIndex);
//             this.CanScrollLeft = firstSelectedIndex > 4 ? true :false;
//             ele.scrollLeft += this.scrollLength * firstSelectedIndex/4;
//             }
//         }
//         if (ele.clientWidth > 0) {
//           clearInterval(timer);
//         }
//       }
//     }, 50)
//   }
  
//   SelectModule(module, index, isReset: boolean = false){
//     if (this.SelectedIndex >= 0 && this.SelectedIndex != index) {
//       if (!this.SubModuleList) {
//         this.SelectModuleAction(module, index, true, true);
//       }
//       else {
//         let moduleChangeConfirmation = false;
//         let selectedSubModule = this.SubModuleList.filter(obj => obj["selected"] == true);
//         if (selectedSubModule != null && selectedSubModule != undefined && selectedSubModule.length > 0){
//           selectedSubModule.forEach(subModule =>{
//             if(subModule.subSubModuleList != null && subModule.subSubModuleList != undefined){
//               let selectedSubSubModIndex = subModule.subSubModuleList.findIndex(x => x["selected"] == true);
//               if(selectedSubSubModIndex < 0){
//                 moduleChangeConfirmation = true;
//               }
//             }
//           })
//         }
//         else {
//           moduleChangeConfirmation = true;
//         }
//         if(moduleChangeConfirmation == true){
//           this.message.confirm(
//             this.l('ProductModuleChangeConfirmationMsg', this.SelectedModule.displayName),
//             this.l('AreYouSure'),
//             isConfirmed => {
//               if(isConfirmed){
//                 this.SelectModuleAction(module, index, true, true);
//               }
//               else{
//                 return;
//               }
//             }
//           );
//         }
//         else{
//           this.SelectModuleAction(module, index, isReset);
//         }
//       }
//     }
//     else{
//       this.SelectModuleAction(module, index, isReset);
//     }
//     console.log(module.id);
//   }
//   async SelectModuleAction(module, index, isReset: boolean = false, isConfirmed = false) {
//     this.SubSubModuleList = [];
//     this.SubModuleList = [];
//     if(!isConfirmed){
//       this.SelectedIndex = index;
//       this.SelectedModule = module;
//     }
//     if (isReset == true) {
//       this.PageModuleList[this.SelectedIndex]["selected"] = false;       
//       if (this.PageSubModuleList != null && this.PageSubModuleList != undefined) {
//         this.PageSubModuleList.forEach(mod => {
//           if (this.SelectedModule != null && mod.moduleId == this.SelectedModule.id) {
//             if (mod.subModuleList != null && mod.subModuleList != undefined) {
//               mod.subModuleList.forEach(subMod => {        
//                 subMod["selected"] = false;
//                 if (subMod.subSubModuleList != null && subMod.subSubModuleList != undefined) {
//                   subMod.subSubModuleList.forEach(subSubMod => {        
//                     subSubMod["selected"] = false;
//                   });
//                 }
//               });
//             }
//           }
//         });
//       }
//       this.SelectedModule = null;
//       this.SelectedIndex = -1;
//       if(isConfirmed){  
//         this.SelectModuleAction(module, index, false);
//       }
//     }
//     else {
//       this.PageModuleList[this.SelectedIndex]["selected"] = true;
//       let subModule = this.PageSubModuleList.filter(obj => obj.moduleId == module.id);
//       if (subModule != null && subModule != undefined && subModule.length > 0) {
//         this.SubModuleList = subModule[0].subModuleList;
//         this.SubSubModuleList = [];
//         let selectedSubModules = this.SubModuleList.filter(obj => obj["selected"] == true);
//         if (selectedSubModules != null && selectedSubModules != undefined) {
//           selectedSubModules.forEach(obj2 => {
//             if(obj2.subSubModuleList != null && obj2.subSubModuleList != undefined && obj2.subSubModuleList.length > 0){
//               obj2.subSubModuleList.forEach(x =>{
//                 this.SubSubModuleList.push(x);
//               })
//             }
//           });
//         }
//       }
//     }
// }

//   SelectSubModule(subIndex,id) {
//     this.PageSubModuleList.forEach(obj => {
//       if (obj.moduleId == this.SelectedModule.id) {
//         if (obj.subModuleList[subIndex]["selected"]) {
//           obj.subModuleList[subIndex]["selected"] = false;
//           if(obj.subModuleList[subIndex].subSubModuleList != null && obj.subModuleList[subIndex].subSubModuleList != undefined)
//           {
//             obj.subModuleList[subIndex].subSubModuleList.forEach(x =>{
//               x["selected"] = false;
//             })
//           }
//         }
//         else {
//           obj.subModuleList[subIndex]["selected"] = true;
//         }
//         this.SubSubModuleList = [];
//         let selectedSubModules = obj.subModuleList.filter(obj1 => obj1["selected"] == true);
//         if (selectedSubModules != null && selectedSubModules != undefined) {
//           selectedSubModules.forEach(obj2 => {
//             if(obj2.subSubModuleList != null && obj2.subSubModuleList != undefined && obj2.subSubModuleList.length > 0){
//               obj2.subSubModuleList.forEach(subSubModule =>{
//                 this.SubSubModuleList.push(subSubModule);
//               })
//             }
//           });
//         }
//       }
//     })
//   }
//   SelectSubSubModule(subSubModuleId) {
//     this.PageSubModuleList.forEach(mod => {
//       if (mod.moduleId == this.SelectedModule.id) {
//         if (mod.subModuleList != null && mod.subModuleList != undefined) {
//           mod.subModuleList.forEach(subMod => {
//             if (subMod.subSubModuleList != null && subMod.subSubModuleList != undefined) {
//               let subSubIndex = subMod.subSubModuleList.findIndex(x => x.id == subSubModuleId);
//               if(subSubIndex >= 0){
//                 if (subMod.subSubModuleList[subSubIndex]["selected"]) {
//                   subMod.subSubModuleList[subSubIndex]["selected"] = false;
//                 }
//                 else {
//                   subMod.subSubModuleList[subSubIndex]["selected"] = true;
//                 }
//               }
//             }
//           });
//         }
//       }
//     });

//   }

}
