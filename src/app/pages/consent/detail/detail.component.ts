import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ConsentService } from '../consent.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, Count } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId, setButtonId, setUserCandidate, setIconId, setUserEmail, getHCID, setJdName, setHCID } from '../../../shared/services/auth.service';
import { setTabName, getTabName, setCollapse, getCollapse } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { PageEvent } from '@angular/material/paginator'; import { MatDialog } from '@angular/material';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  role: any;
  jrId: any;
  jrName: any;
  hcId: any;
  tabs: any;
  items: any;
  collapseAll: boolean;
  tabSelected: string;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  minPageSize = Paging.pageSizeOptions[0] || 10;
  devices: Devices;
  loading: boolean;
  count: Count;
  startFlag: boolean;
  isHybrid: any;
  constructor(
    private router: Router,
    private service: ConsentService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
  ) {
    this.jrId = getJrId();
    if (!this.jrId) {
      this.router.navigate(["/employer/sign-contract/list"]);
    }
    this.role = getRole();
    this.jrName = getJdName();
    this.hcId = getHCID();
    this.collapseAll = getCollapse();
    this.devices = this.utilitiesService.getDevice();
    const tabs = [{
      name: 'PENDING',
    },
    {
      name: 'OBTAINED'
    },
    {
      name: 'EXPIRED'
    }
    ];
    this.tabs = [];
    tabs.forEach(element => {
      let icon: string;
      switch (element.name) {
        case 'PENDING':
          icon = 'clock-outline';
          break;
        case 'OBTAINED':
          icon = 'done-all-outline';
          break;
        case 'EXPIRED':
          icon = 'slash-outline';
          break;
        default:
          icon = 'clock-outline';
          break;
      }
      this.tabs.push({
        name: element.name,
        icon: icon,
        badgeText: 0,
        badgeStatus: 'default',
      })
    });
    this.startFlag = true;
    this.isHybrid = this.role.refCompany.isHybrid || false;
  }

  ngOnInit() {
    this.items = [];
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
    }
  }

  setConsent(key): string {
    let accent = 'success'
    switch (key) {
      case 'PENDING':
        accent = 'warning';
        break;
      case 'REJECT':
        accent = 'danger';
        break;
      case 'CONSENTED':
        accent = 'success';
        break;
      case 'EXPIRED':
        accent = 'basic';
        break;
      default:
        break;
    }
    return accent;
  }

  search() {
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'refCandidate.firstname',
      ]
    };
    this.items = [];
    this.service.getDetail(this.jrId, this.tabSelected).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.items.map(item => {
          item.collapse = this.collapseAll;
          item.accent = this.setConsent(item.refCandidate.consentStatus.status)
        });
        this.paging.length = (response.count && response.count.data) || response.totalDataSize;
        this.setTabCount(response.count);
      }
      this.loading = false;
    });
  }

  onSelectTab(event: any) {
    if (!this.tabSelected && getTabName()) {
      this.tabSelected = getTabName();
      setTabName();
    } else {
      this.tabSelected = event.tabTitle;
    }
    this.paging.pageIndex = 0;
    this.search();
  }

  setTabCount(count: Count) {
    if (count) {
      this.count = count;
      this.tabs.map(element => {
        switch (element.name) {
          case 'PENDING':
            element.badgeText = count.pending;
            element.badgeStatus = 'danger';
            break;
          case 'REJECTED':
            element.badgeText = count.selected;
            element.badgeStatus = 'default';
            break;
          default:
            element.badgeText = '0';
            element.badgeStatus = 'default';
        }
      });
    }
  }

  onClickCollapseAll(value: any) {
    setCollapse(value);
    if (this.items.length) {
      this.items.map(element => {
        element.collapse = value;
      });
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

}
