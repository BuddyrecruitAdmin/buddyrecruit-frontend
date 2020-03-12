import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, DropDownValue, Devices } from '../../../shared/interfaces/common.interface';
import { getRole, setFlowId, setCandidateId, setIsGridLayout } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
import 'style-loader!angular2-toaster/toaster.css';
import { DepartmentService } from '../../setting/department/department.service';

@Component({
  selector: 'ngx-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
  items: any;
  role: any;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  loading: boolean;
  checked: boolean;
  isGridLayout: boolean;
  devices: Devices;
  filter: {
    isFilter: boolean,
    data: {
      jobPosition: DropDownValue[],
      jobStatus: DropDownValue[],
      stage: DropDownValue[],
      subStage: DropDownValue[],
      department: DropDownValue[],
    },
    selected: {
      jobPosition: any,
      jobStatus: any,
      stage: any,
      subStage: any,
      department: any,
    }
  };
  filteredList: any;
  filteredList2: any;
  filteredList3: any;
  filteredList4: any;
  filteredList5: any;
  constructor(
    private service: ReportService,
    private departService: DepartmentService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    if (this.devices.isMobile) {
      this.changeLayout(true);
    } else {
      this.changeLayout(false);
    }
  }

  ngOnInit() {
    this.loading = true;
    this.checked = true;
    this.items = [];
    this.filter = {
      isFilter: false,
      data: {
        jobPosition: [],
        jobStatus: [],
        stage: [],
        subStage: [],
        department: [],
      },
      selected: {
        jobPosition: [],
        jobStatus: [],
        stage: [],
        subStage: [],
        department: [],
      }
    }
    this.refresh();
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

  changePaging(event) {
    this.paging = {
      length: event.length,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.search();
  }

  search() {
    this.items = [];
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'refJR.refJD.position',
        'refStage.name',
        'refCandidate.firstname',
        'refCandidate.lastname',
        'refJR.refStatus.name',
        'refSubStage.name',
        'actionDate',
        'reject.remark',
        'reject.rejectBy.refUser.firstname',
        'reject.rejectBy.refUser.lastname',
        'department.name'
      ],
      filters: [
        {
          name: 'department._id',
          value: this.filter.selected.department
        },
        {
          name: 'refJR.refJD._id',
          value: this.filter.selected.jobPosition
        },
        {
          name: 'refJR.refStatus._id',
          value: this.filter.selected.jobStatus
        },
        {
          name: 'refStage._id',
          value: this.filter.selected.stage
        },
        {
          name: 'refSubStage._id',
          value: this.filter.selected.subStage
        },
      ]
    };
    this.getList();
  }

  getList() {
    this.items = [];
    this.loading = true;
    this.service.getList(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.paging.length = response.totalDataSize;
        if (!this.items.length && this.paging.pageIndex > 0) {
          this.paging.pageIndex--;
          this.search();
        }
        response.filter.jobStatus.forEach(element => {
          this.filter.data.jobStatus.push({
            label: element.name,
            value: element._id
          })
        });
        response.filter.stage.forEach(element => {
          this.filter.data.stage.push({
            label: element.name,
            value: element._id
          })
        });
        response.filter.subStage.forEach(element => {
          this.filter.data.subStage.push({
            label: element.name,
            value: element._id
          })
        });
        // this.items.forEach(element => {
        //   //job status
        //   this.filter.data.jobStatus.push({
        //     label: element.refJR.refStatus.name,
        //     value: element.refJR.refStatus._id
        //   })
        //   //stage
        //   this.filter.data.stage.push({
        //     label: element.refStage.name,
        //     value: element.refStage._id
        //   });
        //   //subStage
        //   this.filter.data.subStage.push({
        //     label: element.refSubStage.name,
        //     value: element.refSubStage._id
        //   })
        // })
        this.filter.data.jobStatus = this.removeDuplicates(this.filter.data.jobStatus, "value")
        this.filter.data.stage = this.removeDuplicates(this.filter.data.stage, "value")
        this.filter.data.subStage = this.removeDuplicates(this.filter.data.subStage, "value")
        this.filteredList3 = this.filter.data.jobStatus.slice();
        this.filteredList4 = this.filter.data.stage.slice();
        this.filteredList5 = this.filter.data.subStage.slice();
        // this.filter.data.department = this.removeDuplicates(this.filter.data.department, "value")
        this.items.map(item => {
          switch (item.refJR.refStatus.name) {
            case "Waiting for HR Confirm":
              item.refJR.refStatus.class = "label-warning";
              break;
            case "Not Start":
              item.refJR.refStatus.class = "label-info";
              break;
            case "In Progress":
              item.refJR.refStatus.class = "label-success";
              break;
            case "Expired":
              item.refJR.refStatus.class = "label-default";
              break;
            case "Reject":
              item.refJR.refStatus.class = "label-danger";
              break;
            case "Active":
              item.refJR.refStatus.class = "label-success";
              break;
            case "Inactive":
              item.refJR.refStatus.class = "label-gray";
              break;
          }
        });
        this.loading = false;
      }
    })
    this.service.getListDepartment().subscribe(res => {
      if (res.code === ResponseCode.Success) {
        res.data.forEach(ele => {
          //department
          this.filter.data.department.push({
            label: ele.name,
            value: ele._id
          })
        })
        this.filter.data.department = this.removeDuplicates(this.filter.data.department, "value");
        this.filteredList = this.filter.data.department.slice();
      }
    })
    this.service.getPositionList().subscribe(response => {
      if (response.code === ResponseCode.Success) {
        response.data.forEach(item => {
          this.filter.data.jobPosition.push({
            label: item.position,
            value: item._id
          })
        });
        this.filter.data.jobPosition = this.removeDuplicates(this.filter.data.jobPosition, "value");
        this.filteredList2 = this.filter.data.jobPosition.slice();
      }
    })
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  info(item: any) {
    setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupCvComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      setCandidateId();
    });
  }

  filterToggle() {
    this.filter.isFilter = !this.filter.isFilter;
    if (!this.filter.isFilter) {
      this.clearFilter();
      this.search();
    }
  }

  changeLayout(value) {
    this.isGridLayout = value;
    setIsGridLayout(value);
  }

  clearFilter() {
    if (this.filter.selected.jobPosition.length || this.filter.selected.jobStatus.length
      || this.filter.selected.subStage.length || this.filter.selected.stage.length ||
      this.filter.selected.department.length
    ) {
      this.filter.selected.jobPosition = [];
      this.filter.selected.stage = [];
      this.filter.selected.subStage = [];
      this.filter.selected.jobStatus = [];
      this.filter.selected.department = [];
      this.search();
    }
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

}
