import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ExamService } from '../exam.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, DropDownValue, DropDownGroup } from '../../../shared/interfaces/common.interface';
import { getRole, setJdId, setJdName, setJrId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { PopupJrInfoComponent } from '../../../component/popup-jr-info/popup-jr-info.component';

@Component({
  selector: 'ngx-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {
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
    isFilter: boolean;
    data: {
      departments: DropDownValue[],
      divisions: DropDownGroup[]
    },
    temp: {
      departments: DropDownValue[],
      divisions: DropDownGroup[]
    },
    selected: {
      departments: any,
      divisions: any,
    }
  };

  constructor(
    private router: Router,
    private service: ExamService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
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
        departments: [],
        divisions: []
      },
      temp: {
        departments: [],
        divisions: []
      },
      selected: {
        departments: [],
        divisions: []
      }
    }
    if (this.devices.isMobile || this.devices.isTablet) {
      this.isGridLayout = true;
    } else {
      this.isGridLayout = false;
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
        'refJD.position',
        'departmentName',
        'divisionName'
      ],
      filters: [
        {
          name: 'departmentId',
          value: this.filter.selected.departments
        },
        {
          name: 'divisionId',
          value: this.filter.selected.divisions
        }
      ]
    };
    this.items = [];
    this.service.getList(this.criteria, this.role.refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.map(item => {
          item.daysBeforeExpiry = this.utilitiesService.calculateDuration2Date(new Date(), item.duration.endDate)
        });
        this.paging.length = response.totalDataSize;
        if (!this.filter.data.departments.length) {
          response.filter.departments.forEach(department => {
            this.filter.data.departments.push({
              label: department.name,
              value: department._id
            });
            this.filter.temp.departments.push({
              label: department.name,
              value: department._id
            });
            department.divisions.forEach(division => {
              this.filter.data.divisions.push({
                label: division.name,
                value: division._id,
                group: department._id
              });
              this.filter.temp.divisions.push({
                label: division.name,
                value: division._id,
                group: department._id
              });
            });
          });
        }
      }
      this.loading = false;
    });
  }

  filterToggle() {
    this.filter.isFilter = !this.filter.isFilter;
    if (!this.filter.isFilter) {
      this.filter.selected.departments = [];
      this.filter.selected.divisions = [];
      this.filter.data.divisions = _.cloneDeep(this.filter.temp.divisions);
      this.search();
    }
  }

  changeFilter(calculate: boolean = true) {
    if (calculate) {
      this.filter.data.divisions = [];
      this.filter.selected.departments.forEach(department => {
        const divisions = this.filter.temp.divisions.filter(division => {
          return division.group === department;
        });
        divisions.forEach(division => {
          this.filter.data.divisions.push({
            label: division.label,
            value: division.value,
            group: department
          });
        });
      });
      const divisionSelected = _.cloneDeep(this.filter.selected.divisions);
      this.filter.selected.divisions = [];
      if (divisionSelected.length) {
        divisionSelected.forEach(division => {
          const found = this.filter.data.divisions.find(element => {
            return element.value === division;
          });
          if (found) {
            this.filter.selected.divisions.push(found.value);
          }
        });
      }
    }
    this.search();
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
    setJdId(item.refJD._id);
    setJdName(item.refJD.position);
    setJrId(item._id);
    this.router.navigate(["/exam/detail"]);
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
