import { Component, OnInit, TemplateRef } from '@angular/core';
import { Criteria, Paging as IPaging, Devices } from '../../../shared/interfaces/common.interface';
import { PageEvent } from '@angular/material/paginator';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { JobPositionService } from '../job-position/job-position.service';
import { MatDialog } from '@angular/material';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { getRole, getJdName, getJrId, setFlowId, getIsGridLayout, setIsGridLayout } from '../../../shared/services/auth.service';
import { NbDialogService, NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
import * as _ from 'lodash';
import { DropDownValue, DropDownGroup } from '../../../shared/interfaces/common.interface';
@Component({
  selector: 'ngx-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnInit {
  role: any;
  items: any;
  itemDialog: any;
  statusList = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' }
  ];
  dialogRef: NbDialogRef<any>;

  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  loading: boolean;
  loadingDialog: boolean;
  minPageSize = Paging.pageSizeOptions[0];
  devices: Devices;
  isGridLayout: boolean;
  provinceList: DropDownValue[];
  districtList: DropDownGroup[];
  provinceListArr: any;
  districtListArr: any;
  subDistrictList: DropDownValue[];
  subDistrictListArr: any;
  provinceSelect: any;
  districtSelect: any;
  subDistrictSelect: any;
  filteredList: any;
  filteredList2: any;
  filteredList3: any;
  hubs: any;
  noticeHeight: any;
  _id: any;
  listAll: any;
  listFiltered: any;
  sError: string;
  constructor(
    private service: JobPositionService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.isGridLayout = getIsGridLayout();
    this.noticeHeight = window.innerHeight * 0.85;
    if (!this.isGridLayout) {
      if (this.devices.isMobile || this.devices.isTablet) {
        this.isGridLayout = true;
      } else {
        this.isGridLayout = false;
      }
    }
  }

  ngOnInit() {
    this.loading = true;

    this.provinceListArr = [];
    this.filteredList = [];
    this.refresh();
  }

  initialModel(): any {
    const itemDialog = {
      _id: undefined,
      name: undefined,
      remark: undefined,
      active: undefined,
      isUsed: undefined,
    }
    return itemDialog;
  }

  refresh() {
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.search();
  }

  search() {
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'name',
        'lastChangedInfo.refUser.firstname',
        'lastChangedInfo.refUser.lastname',
        'lastChangedInfo.date',
        'remark',
        'active',
      ]
    };
    this.items = [];
    this.service.getList(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.paging.length = response.totalDataSize;

        if (!this.items.length && this.paging.pageIndex > 0) {
          this.paging.pageIndex--;
          this.search();
        }
      }
      this.loading = false;
    });
  }

  // เรียก popup
  edit(item: any, dialog: TemplateRef<any>) {
    this.hubs = [];
    this.districtListArr = [];
    this.subDistrictListArr = [];
    this.listAll = [];
    this.listFiltered = [];
    this.itemDialog = _.cloneDeep(item);
    this.getProvince().then((response) => {
      this.service.getDetail(item._id).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          this.hubs = response.data.provinces;
          if (this.hubs.length === 0) {
            this.addHubs();
          } else {
            this.addHublist();
          }
          this._id = response.data._id;
        }
      })
      this.callDialog(dialog);
    });
  }

  addHubs() {
    this.hubs.push({
      refProvince: "",
      isAllDistrict: false,
      remark: "",
      districts: [],
      hubsFlag: true,
    })
    this.listAll.push([]);
    this.listFiltered.push([]);
    this.provinceListArr[this.hubs.length - 1] = this.provinceList;
    this.filteredList[this.hubs.length - 1] = this.provinceList.slice();
  }

  addHublist() {
    // detail list province

    this.hubs.forEach((element, index) => {
      this.listAll.push([]);
      this.listFiltered.push([]);
      this.provinceListArr[index] = this.provinceList;
      this.filteredList[index] = this.provinceList.slice();
      //list อำเภอ
      if (element.districts) {
        element.districts.forEach((element2, jIndex) => {
          this.listAll[index].push({ main: [], sub: [] });
          this.listFiltered[index].push({ main: [], sub: [] });
          this.getDistrict(element.refProvince, index, this.listAll[index].length - 1, element);
          // list ตำบล
          if (element2.subDistricts) {
            element2.subDistricts.forEach((element3, kIndex) => {
              this.listAll[index][jIndex].sub.push([]);
              this.listFiltered[index][jIndex].sub.push([]);
              this.getSubDistrict(element2.refDistrict, index, jIndex, this.listAll[index][jIndex].sub.length - 1, element2)
            })
          }
        });
      }
    })
  }

  // เพิ่มอำเภอ
  addDistrict(hub, index) {
    hub.districts.push({
      refDistrict: "",
      isAllSubDistrict: true,
      remark: "",
      subDistricts: []
    })
    // start here index form province 
    this.listAll[index].push({ main: [], sub: [] });
    this.listFiltered[index].push({ main: [], sub: [] });
    this.getDistrict(hub.refProvince, index, this.listAll[index].length - 1, hub);
  }
  // เพิ่มตำบล
  addSubDistrict(dis, index, jIndex) {
    dis.subDistricts.push({
      refSubDistrict: "",
      remark: "",
    })
    this.listAll[index][jIndex].sub.push([]);
    this.listFiltered[index][jIndex].sub.push([]);
    this.getSubDistrict(dis.refDistrict, index, jIndex, this.listAll[index][jIndex].sub.length - 1, dis)
  }

  async getProvince() {
    await this.loadProvince();
  }

  loadProvince() {
    return new Promise((resolve) => {
      this.loadingDialog = true;
      this.provinceList = [];
      this.service.getProvince().subscribe(response => {
        if (response.code === ResponseCode.Success) {
          response.data.forEach(item => {
            this.provinceList.push({
              label: item.name.th,
              value: item._id
            });
          });
          this.loadingDialog = false;
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  getDistrict(value, index, jIndex, hub) {
    if (hub.districts.length > 0) {
      this.loadingDialog = true;
      this.districtList = [];
      this.service.getDistrict(value).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          response.data.forEach((item, index) => {
            this.districtList.push({
              label: item.name.th,
              value: item._id,
              group: index
            });
          });
          //start here
          if (jIndex === 'all') {
            this.listAll[index] = [];
            hub.districts.length = 0;
          } else {
            this.listAll[index][jIndex].main = this.districtList;
            this.listFiltered[index][jIndex].main = this.listAll[index][jIndex].main.slice();
          }
        }
        this.loadingDialog = false;
      })
    }
  }

  getSubDistrict(value, index, j, jIndex, dis) {
    if (dis.subDistricts.length > 0) {
      this.loadingDialog = true;
      this.subDistrictList = [];
      this.service.getSubDistrict(value).subscribe(response => {
        if (response.code === ResponseCode.Success) {
          response.data.forEach(item => {
            this.subDistrictList.push({
              label: item.name.th,
              value: item._id
            });
          });
          if (jIndex === 'all') {
            this.listAll[index][j].sub = [];
            dis.subDistricts.length = 0;
          } else {
            this.listAll[index][j].sub[jIndex] = this.subDistrictList;
            this.listFiltered[index][j].sub[jIndex] = this.listAll[index][j].sub[jIndex].slice();
          }
        }
        this.loadingDialog = false;
      })
    }
  }

  deleteProvince(index) {
    this.hubs.splice(index, 1);
    this.listAll.splice(index, 1);
  }

  deleteDistrict(index, jIndex) {
    this.hubs[index].districts.splice(jIndex, 1);
    console.log(this.listAll)
    this.listAll[index].splice(jIndex, 1);
  }

  deleteSubDistrict(index, jIndex, kIndex) {
    this.hubs[index].districts[jIndex].subDistricts.splice(kIndex, 1);
    this.listAll[index][jIndex].sub.splice(index, 1);
  }

  save() {
    if (this.dialogRef) {
      if (this.validation()) {
        const request = this.setRequest();
        this.service.hubEdit(this._id, request).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.dialogRef.close();
            this.showToast('success', 'Success Message', response.message);
            this.search();
          } else {
            this.dialogRef.close();
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    }
  }

  setRequest(): any {
    this.hubs.map(element => {
      if (element.districts.length === 0) {
        element.isAllDistrict = true;
      } else {
        element.isAllDistrict = false;
        element.districts.map(element2 => {
          if (element2.subDistricts.length === 0) {
            element2.isAllSubDistrict = true;
          } else {
            element2.isAllSubDistrict = false;
          }
        })
      }
    })
    const data = this.hubs;
    return data;
  }

  validation(): boolean {
    let isValid = true;
    this.sError = '';
    this.hubs.map(element => {
      if (!element.refProvince) {
        isValid = false;
        this.sError = 'Please complete all fields.';
      }
      if (element.districts.length > 0) {
        element.districts.map(element2 => {
          if (!element2.refDistrict) {
            isValid = false;
            this.sError = 'Please complete all fields.';
          }
          if (element2.subDistricts.length > 0) {
            element2.subDistricts.map(element3 => {
              if (!element3.refSubDistrict) {
                isValid = false;
                this.sError = 'Please complete all fields.';
              }
            })
          }
        })
      }
    })
    return isValid;
  }

  delete(item: any) {
    const confirm = this.matDialog.open(PopupMessageComponent, {
      width: `${this.utilitiesService.getWidthOfPopupCard()}px`,
      data: { type: 'D' }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteItem(item).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.showToast('success', 'Success Message', response.message);
            this.search();
          } else {
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      }
    });
  }

  changePaging(event) {
    this.paging = {
      length: event.length,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.loading = true;
    this.search();
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

  changeLayout(value) {
    this.isGridLayout = value;
    setIsGridLayout(value);
  }

  showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 5000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    this.toastrService.show(body, title, config);
  }

}
