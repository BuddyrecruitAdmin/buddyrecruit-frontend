import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocationService } from './location.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, DropDownValue } from '../../../shared/interfaces/common.interface';
import { getRole, getIsGridLayout, setIsGridLayout, getBranchItem, setBranchItem } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  role: any;
  items: any;
  itemDialog: any;
  dialogRef: NbDialogRef<any>;

  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0];
  devices: Devices;
  isGridLayout: boolean;
  loading: any = false;
  noticeHeight: any;
  filter: {
    isFilter: boolean,
    data: {
      provinces: DropDownValue[],
      types: DropDownValue[]
    },
    temp: {
      provinces: DropDownValue[],
      types: DropDownValue[]
    },
    selected: {
      provinces: any,
      types: any,
    }
  };
  filteredTypes: any;
  filteredTypes2: any;
  @ViewChild('dialog', { static: false }) templateref: TemplateRef<any>;
  branch: any;
  constructor(
    private service: LocationService,
    private dialogService: NbDialogService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.isGridLayout = getIsGridLayout();
    if (!this.isGridLayout) {
      if (this.devices.isMobile || this.devices.isTablet) {
        this.isGridLayout = true;
      } else {
        this.isGridLayout = false;
      }
    }
    this.noticeHeight = window.innerHeight * 0.9;
    this.branch = getBranchItem();
    setBranchItem();
  }

  ngOnInit() {
    this.getFilterList();
    this.getFilterProvinces();
    this.refresh();
  }

  initialModel(): any {
    const itemDialog = {
      _id: undefined,
      type: undefined,
      refRegion: undefined,
      refProvince: undefined,
      name: undefined,
      nickname: undefined,
      refCompany: undefined,
      createdInfo: {
        date: null,
        refUser: undefined
      },
      lastChangedInfo: {
        date: null,
        refUser: undefined
      },
      isDeleted: false,
      code: undefined,
      detail: undefined,
      linkMap: undefined
    }
    return itemDialog;
  }

  getFilterProvinces(types: any = undefined) {
    this.service.getProvincesType(undefined, types).subscribe(response => {
      if (ResponseCode.Success === response.code) {
        this.filter.data.provinces = [];
        response.data.forEach(element => {
          this.filter.data.provinces.push({
            label: element.name.en,
            value: element._id
          })
        });
        this.filteredTypes = this.filter.data.provinces.slice();
      }
    })
  }

  getFilterList(provinces: any = undefined) {
    return new Promise((resolve) => {
      this.service.getLocationType(undefined, provinces).subscribe(response => {
        if (ResponseCode.Success === response.code) {
          this.filter.data.types = [];
          response.data.forEach(element => {
            this.filter.data.types.push({
              label: element,
              value: element
            })
          });
          this.filteredTypes2 = this.filter.data.types.slice();
        }
        resolve();
      })
    });
  }

  refresh() {
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.filter = {
      isFilter: true,
      data: {
        provinces: [],
        types: []
      },
      temp: {
        provinces: [],
        types: []
      },
      selected: {
        provinces: [],
        types: []
      }
    }
    this.search();
  }

  search() {
    if (this.branch) {
      this.keyword = this.branch.name;
    }
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filters: [
        {
          name: 'provinces',
          value: this.filter.selected.provinces
        },
        {
          name: 'types',
          value: this.filter.selected.types
        }
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
        if (this.branch) {
          this.openBranch(this.branch._id);
        }
      } else {
        this.showToast('danger', 'Error Message', response.message);
      }
    });
  }

  changeLayout(value) {
    this.isGridLayout = value;
    setIsGridLayout(value);
  }

  filterToggle() {
    this.filter.isFilter = !this.filter.isFilter;
    if (!this.filter.isFilter) {
      this.filter.selected.provinces = [];
      this.filter.selected.types = [];
      this.filter.data.types = _.cloneDeep(this.filter.temp.types);
      this.getFilterList();
      this.search();
    }
  }

  clearFilter() {
    if (this.filter.selected.provinces.length || this.filter.selected.types.length) {
      this.filter.selected.provinces = [];
      this.filter.selected.types = [];
      this.filter.data.types = _.cloneDeep(this.filter.temp.types);
      this.getFilterList();
      this.search();
    }
  }

  async changeFilter(type: string) {
    switch (type) {
      case 'province':
        await this.getFilterList(this.filter.selected.provinces);
        break;
      case 'type':
        await this.getFilterProvinces(this.filter.selected.types);
        break;
      default:
        break;
    }
    this.search()
  }

  openBranch(id) {
    this.branch = undefined;
    this.items.forEach(element => {
      if (id === element._id) {
        this.edit(element, this.templateref)
      }
    });
  }

  edit(item: any, dialog: TemplateRef<any>) {
    this.itemDialog = _.cloneDeep(item);
    this.callDialog(dialog);
  }

  save() {
    if (this.dialogRef) {
      if (this.itemDialog._id) {
        this.service.edit(this.itemDialog).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            this.dialogRef.close();
            this.showToast('success', 'Success Message', response.message);
            this.search();
          } else {
            this.dialogRef.close();
            this.showToast('danger', 'Error Message', response.message);
          }
        });
      } else {
        this.service.create(this.itemDialog).subscribe(response => {
          if (response.code === ResponseCode.Success) {
            const pageIndex = Math.ceil((this.paging.length + 1) / this.paging.pageSize);
            this.paging.pageIndex = pageIndex - 1;
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

  changePaging(event) {
    this.paging = {
      length: event.length,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.search();
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
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
