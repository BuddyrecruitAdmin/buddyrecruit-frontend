import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { OnboardService } from '../onboard.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, DropDownValue } from '../../../shared/interfaces/common.interface';
import { getRole, setJdId, setJdName, setJrId, setIsGridLayout, getIsGridLayout, setHCID } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupJrInfoComponent } from '../../../component/popup-jr-info/popup-jr-info.component';
import { LocationService } from '../../setting/location/location.service';
@Component({
  selector: 'ngx-onboard-list',
  templateUrl: './onboard-list.component.html',
  styleUrls: ['./onboard-list.component.scss']
})
export class OnboardListComponent implements OnInit {
  role: any;
  items: any;

  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0];
  devices: Devices;
  loading: boolean;
  isGridLayout: boolean;
  filter: {
    isFilter: boolean,
    data: {
      provinces: DropDownValue[],
      types: DropDownValue[],
      branchs: DropDownValue[]
    },
    temp: {
      provinces: DropDownValue[],
      types: DropDownValue[],
      branchs: DropDownValue[]
    },
    selected: {
      provinces: any,
      types: any,
      branchs: any
    }
  };
  showStepper: boolean;
  filteredProvince: any;
  filteredType: any;
  filteredBranch: any;
  isExpress: boolean;
  isHybrid: boolean;
  constructor(
    private router: Router,
    private service: OnboardService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private locationService: LocationService
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.isGridLayout = getIsGridLayout();
    this.isExpress = this.role.refCompany.isExpress;
    this.isHybrid = this.role.refCompany.isHybrid;
    if (this.devices.isMobile || this.devices.isTablet) {
      this.isGridLayout = this.isGridLayout ? this.isGridLayout : true;
      this.showStepper = false;
    } else {
      this.isGridLayout = this.isGridLayout ? this.isGridLayout : false;
      this.showStepper = true;
    }
  }

  ngOnInit() {
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
        types: [],
        branchs: []
      },
      temp: {
        provinces: [],
        types: [],
        branchs: []
      },
      selected: {
        provinces: [],
        types: [],
        branchs: []
      }
    }
    this.getServiceFilter();
    this.search();
  }

  async getServiceFilter() {
    await this.getFilterProvinces();
    await this.getFilterList();
    await this.getFilterBranch();
  }

  search() {
    this.loading = true;
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
        },
        {
          name: 'branchs',
          value: this.filter.selected.branchs
        }
      ]
    };
    this.items = [];
    this.service.getList(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.map(item => {
          item.daysBeforeExpire = this.utilitiesService.calculateDuration2Date(new Date(), item.duration.endDate);
        });
        this.paging.length = response.totalDataSize;
      }
      this.loading = false;
    });
  }

  getFilterProvinces(branchs: any = undefined, types: any = undefined) {
    return new Promise((resolve) => {
      this.filter.data.provinces = [];
      this.locationService.getProvincesType(branchs, types).subscribe(response => {
        if (ResponseCode.Success === response.code) {
          response.data.forEach(element => {
            this.filter.data.provinces.push({
              label: element.name.en,
              value: element._id
            })
          });
          this.filteredProvince = this.filter.data.provinces.slice();
        }
        resolve();
      })
    });
  }

  getFilterList(branchs: any = undefined, provinces: any = undefined) {
    return new Promise((resolve) => {
      this.filter.data.types = [];
      this.locationService.getLocationType(branchs, provinces).subscribe(response => {
        if (ResponseCode.Success === response.code) {
          response.data.forEach(element => {
            this.filter.data.types.push({
              label: element,
              value: element
            })
          });
          this.filteredType = this.filter.data.types.slice();
        }
        resolve();
      })
    });
  }


  getFilterBranch(types: any = undefined, provinces: any = undefined) {
    return new Promise((resolve) => {
      this.filter.data.branchs = [];
      this.locationService.getList(undefined, types, provinces).subscribe(response => {
        if (ResponseCode.Success === response.code) {
          response.data.forEach(element => {
            this.filter.data.branchs.push({
              label: element.name,
              value: element._id
            })
          });
          this.filteredBranch = this.filter.data.branchs.slice();
        }
        resolve();
      })
    });
  }

  filterToggle() {
    this.filter.isFilter = !this.filter.isFilter;
    if (!this.filter.isFilter) {
      this.filter.selected.provinces = [];
      this.filter.selected.types = [];
      this.filter.data.types = _.cloneDeep(this.filter.temp.types);
      this.search();
    }
  }

  clearFilter() {
    if (this.filter.selected.provinces.length || this.filter.selected.types.length
      || this.filter.selected.branchs.length || this.keyword) {
      this.filter.selected.provinces = [];
      this.filter.selected.types = [];
      this.filter.selected.branchs = [];
      this.keyword = '';
      this.getServiceFilter();
      this.search();
    }
  }

  async changeFilter(type: string) {
    this.paging.pageIndex = 0;
    switch (type) {
      case 'branch':
        await this.getFilterList(this.filter.selected.branchs, this.filter.selected.provinces);
        await this.getFilterProvinces(this.filter.selected.branchs, this.filter.selected.types);
        break;
      case 'province':
        await this.getFilterList(this.filter.selected.branchs, this.filter.selected.provinces);
        await this.getFilterBranch(this.filter.selected.types, this.filter.selected.provinces);
        break;
      case 'type':
        await this.getFilterBranch(this.filter.selected.types, this.filter.selected.provinces);
        await this.getFilterProvinces(this.filter.selected.branchs, this.filter.selected.types);
        break;
      default:
        break;
    }
    this.search()
  }

  async checkTypes() {
    return new Promise((resolve) => {
      let typesSelect = [];
      this.filter.data.types.forEach(element => {
        this.filter.selected.types.forEach(elem => {
          if (element.value === elem) {
            typesSelect.push(elem);
          }
        });
      })
      this.filter.selected.types = typesSelect;
      this.search();
      resolve()
    });
  }

  changeLayout(value) {
    this.isGridLayout = value;
    setIsGridLayout(value);
  }

  info(item: any) {
    setJrId(item._id);
    setJdName(item.refJD.position);
    this.dialogService.open(PopupJrInfoComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => setJrId());
  }

  edit(item: any) {
    // pass type blue or white
    setJdId(item.refJD.refJobType.type);
    setJdName(item.refJD.position);
    setJrId(item._id);
    if (this.isHybrid) {
      setHCID(item.hc_id)
    }
    this.router.navigate(["/employer/onboard/detail"]);
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
