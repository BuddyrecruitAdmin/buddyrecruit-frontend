import { Component, OnInit, TemplateRef, Input, HostListener } from '@angular/core';
import { ReportService } from '../report.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, Devices, DropDownValue, DropDownGroup } from '../../../shared/interfaces/common.interface';
import { getRole, getJdName, getJrId, setFlowId, setCandidateId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupCvComponent } from '../../../component/popup-cv/popup-cv.component';
@Component({
  selector: 'ngx-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  role: any;
  checked: boolean;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  loading: boolean;
  items: any;
  filter: {
    data: {
      jobPosition: DropDownValue[],
      candidateName: DropDownValue[],
      fieldName: DropDownValue[],
      createBy: DropDownValue[]
      candidateId: DropDownValue[]
    },
    selected: {
      jobPosition: any,
      candidateName: any,
      fieldName: any,
      createBy: any
      candidateId: any
    }
  };
  constructor(
    private service: ReportService,
    private utilitiesService: UtilitiesService,
    public matDialog: MatDialog,
    private dialogService: NbDialogService,
  ) {
    this.role = getRole();
  }

  ngOnInit() {
    this.loading = true;
    this.checked = false;
    this.items = [];
    this.filter = {
      data: {
        jobPosition: [],
        candidateName: [],
        fieldName: [],
        createBy: [],
        candidateId: []
      },
      selected: {
        jobPosition: [],
        candidateName: [],
        fieldName: [],
        createBy: [],
        candidateId: []
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
    this.loading = true;
    this.search();
  }

  search() {
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize,
      filter: [
        'refJR.refJD.position',
        'fieldName',
        'fieldText',
        'refCandidate.lastname',
        'refCandidate.firstname',
        'remark',
        'createdInfo.refUser.firstname',
        'createdInfo.refUser.lastname',
      ],
      filters: [
        {
          name: 'refJR.refJD._id',
          value: this.filter.selected.jobPosition
        },
        {
          name: 'refCandidate._id',
          value: this.filter.selected.candidateName
        },
        {
          name: 'fieldName',
          value: this.filter.selected.fieldName
        },
        {
          name: 'createdInfo.refUser._id',
          value: this.filter.selected.createBy
        },
        {
          name: 'refCandidate._id',
          value: this.filter.selected.candidateId
        },
      ]
    }
    this.getList();
  }

  getList() {
    this.service.getListReport(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.paging.length = response.totalDataSize;
console.log(response)
        if (!this.items.length && this.paging.pageIndex > 0) {
          this.paging.pageIndex--;
          this.search();
        }
        this.items = response.data;
        this.items.forEach(element => {
          this.filter.data.candidateName.push({
            label: this.utilitiesService.setFullname(element.refCandidate),
            value: element.refCandidate._id
          })
          this.filter.data.jobPosition.push({
            label: element.refJR.refJD.position,
            value: element.refJR.refJD._id
          });
          this.filter.data.fieldName.push({
            label: element.fieldName,
            value: element.fieldName
          });
          this.filter.data.createBy.push({
            label: this.utilitiesService.setFullname(element.createdInfo.refUser),
            value: element.createdInfo.refUser._id
          })
          this.filter.data.candidateId.push({
            label: element.refCandidate._id,
            value: element.refCandidate._id
          })
        });
        this.filter.data.candidateName = this.removeDuplicates(this.filter.data.candidateName, "value");
        this.filter.data.jobPosition = this.removeDuplicates(this.filter.data.jobPosition, "value");
        this.filter.data.fieldName = this.removeDuplicates(this.filter.data.fieldName, "value");
        this.filter.data.createBy = this.removeDuplicates(this.filter.data.createBy, "value");
        this.filter.data.candidateId = this.removeDuplicates(this.filter.data.candidateId, "value");
        console.log(this.items)
      }
    })
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  checkList(item, checked) {
    console.log(checked)
    this.service.edit(item._id, checked.checked).subscribe(response => {
    })
  }

  info(item: any) {
    // setFlowId(item._id);
    setCandidateId(item.refCandidate._id);
    this.dialogService.open(PopupCvComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      if (result) {
        this.search();
      }
    });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

}
