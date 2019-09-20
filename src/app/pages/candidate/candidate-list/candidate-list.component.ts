import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CandidateService } from '../candidate.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, DropDownValue } from '../../../shared/interfaces/common.interface';
import { getRole, getKeyword, setKeyword, setCandidateId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { PopupMessageComponent } from '../../../component/popup-message/popup-message.component';
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

  constructor(
    private router: Router,
    private service: CandidateService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
    this.keyword = getKeyword() || '';
    this.devices = this.utilitiesService.getDevice();
    setKeyword();
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
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: []
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

  back() {
    this.router.navigate(["/home"]);
  }

  edit(item: any) {
    setCandidateId(item._id);
    this.router.navigate(["/candidate/detail"]);
  }

  info(item: any) {

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
