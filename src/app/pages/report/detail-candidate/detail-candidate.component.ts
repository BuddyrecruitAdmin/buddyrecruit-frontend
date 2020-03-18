import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReportService } from '../report.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, DropDownValue, Devices } from '../../../shared/interfaces/common.interface';
import { getRole, setFlowId, setCandidateId, setIsGridLayout } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import 'style-loader!angular2-toaster/toaster.css';
import { DepartmentService } from '../../setting/department/department.service';
@Component({
  selector: 'ngx-detail-candidate',
  templateUrl: './detail-candidate.component.html',
  styleUrls: ['./detail-candidate.component.scss']
})
export class DetailCandidateComponent implements OnInit {
  items: any;
  select: any;
  role: any;
  devices: Devices;
  loading: boolean;
  dialogRef: NbDialogRef<any>;
  paging: IPaging;
  keyword: string;
  innerWidth: any;
  innerHeight: any;
  filter: {
    isFilter: boolean,
    data: any,
    temp: any,
    selected: {
      name: any,
      jr: any,
      comment: any,
      exam: any,
      interview: any,
      reject: any,
    }
  };
  criteria: Criteria;
  constructor(
    private service: ReportService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
    this.innerHeight = window.innerHeight * 0.8;
    this.innerWidth = window.innerWidth * 0.6;
    // if (this.devices.isMobile) {
    //   this.changeLayout(true);
    // } else {
    //   this.changeLayout(false);
    // }
  }

  ngOnInit() {
    this.loading = false;
    this.items = [];
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.filter = {
      isFilter: true,
      data: [],
      temp: [],
      selected: {
        name: "",
        jr: "",
        comment: "",
        exam: "",
        interview: "",
        reject: "",
      }
    }
    this.getList();

  }

  getList() {
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filters: [
        {
          name: 'name',
          value: this.filter.selected.name
        },
        {
          name: 'jr',
          value: this.filter.selected.jr
        },
        {
          name: 'comment',
          value: this.filter.selected.comment
        },
        {
          name: 'exam',
          value: this.filter.selected.exam
        },
        {
          name: 'interview',
          value: this.filter.selected.interview
        },
        {
          name: 'reject',
          value: this.filter.selected.reject
        }
      ]
    };
    this.service.getListCandidate(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
      }
    })
  }

  openApplication(item: any) {
    const path = '/appform/view/' + item._id;
    // this.router.navigate([path])
    window.open(path);
  }

  exportAsXLSX(): void {
    this.service.exportAsExcelFile(this.items, 'sample');
  }

  open(dialog: TemplateRef<any>, name: string, item: any) {
    this.select = item;
    this.callDialog(dialog);
  }

  changePaging(event) {
    this.paging = {
      length: event.length,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      pageSizeOptions: Paging.pageSizeOptions
    }
    this.getList();
  }

  callDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, { closeOnBackdropClick: false });
  }

}
