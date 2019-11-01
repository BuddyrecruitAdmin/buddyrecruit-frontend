import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CandidateService } from '../candidate.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices } from '../../../shared/interfaces/common.interface';
import { getRole, getKeyword, setKeyword, setCandidateId, setJrId, setJdName, setFlowId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import 'style-loader!angular2-toaster/toaster.css';
import { NbDialogService } from '@nebular/theme';
import { PopupJrInfoComponent } from '../../../component/popup-jr-info/popup-jr-info.component';

@Component({
  selector: 'ngx-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
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
  filterAll: boolean;
  filters = [
    {
      text: 'Department',
      filter: 'candidateFlow.refJR.department.name',
      active: true,
    },
    {
      text: 'Division',
      filter: 'candidateFlow.refJR.division.name',
      active: true,
    },
    {
      text: 'JobPosition',
      filter: 'candidateFlow.refJR.refJD.position',
      active: true,
    },
    {
      text: 'Stage',
      filter: 'candidateFlow.refStage.refMain.name',
      active: true,
    },
    {
      text: 'Name',
      filter: 'firstname',
      active: true,
    },
    {
      text: 'Phone',
      filter: 'phone',
      active: true,
    },
    {
      text: 'Birthday (dd/mm/yyyy)',
      filter: 'birth',
      active: true,
    },
    {
      text: 'Email',
      filter: 'email',
      active: true,
    },
    {
      text: 'Age',
      filter: 'age',
      active: true,
    },
    {
      text: 'Address',
      filter: 'address',
      active: true,
    },
    {
      text: 'Education',
      filter: 'university',
      active: true,
    },
    {
      text: 'HardSkill',
      filter: 'hardSkill',
      active: true,
    },
    {
      text: 'SoftSkill',
      filter: 'softSkill',
      active: true,
    }
  ];

  constructor(
    private router: Router,
    private service: CandidateService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.keyword = getKeyword() || '';
    this.devices = this.utilitiesService.getDevice();
    setKeyword();
    this.filterAll = true;
  }

  ngOnInit() {
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
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
    const filter = this.filters.filter(element => {
      return element.active;
    }).map(element => {
      return element.filter;
    });
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: filter
    };
    this.items = [];
    this.service.getList(this.criteria, this.role.refCompany).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.paging.length = response.totalDataSize;
      }
      this.loading = false;
    });
  }

  changeFilter(value) {
    const found = this.filters.find(element => {
      return !element.active;
    });
    if (found || !value) {
      this.filterAll = false;
    }
  }

  changeFilterAll(value) {
    this.filters.map(element => {
      element.active = value;
    });
  }

  back() {
    this.router.navigate(["/home"]);
  }

  edit(item: any) {
    setFlowId(item.candidateFlow._id)
    setCandidateId(item._id);
    this.router.navigate(["/candidate/detail"]);
  }

  info(item: any) {
    setJrId(item.candidateFlow.refJR._id);
    setJdName(item.candidateFlow.refJR.refJD.position);
    this.dialogService.open(PopupJrInfoComponent,
      {
        closeOnBackdropClick: true,
        hasScroll: true,
      }
    ).onClose.subscribe(result => setJrId());
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

}
