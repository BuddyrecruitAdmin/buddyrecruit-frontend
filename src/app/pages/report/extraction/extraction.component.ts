import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReportService } from '../report.service';
import { ResponseCode, Paging } from '../../../shared/app.constants';
import { Criteria, Paging as IPaging, DropDownValue, Devices } from '../../../shared/interfaces/common.interface';
import { getRole, setFlowId, setCandidateId, setIsGridLayout, setCompanyId } from '../../../shared/services/auth.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import * as _ from 'lodash';
import { NbDialogService, NbDialogRef, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { PopupExtractionComponent } from '../../../component/popup-extraction/popup-extraction.component';
import 'style-loader!angular2-toaster/toaster.css';
import { JdService } from '../../../pages/jd/jd.service';
import { saveAs } from "file-saver";
@Component({
  selector: 'ngx-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.scss']
})
export class ExtractionComponent implements OnInit {
  items: any;
  role: any;
  keyword: string;
  paging: IPaging;
  pageEvent: PageEvent;
  criteria: Criteria;
  loading: boolean;
  devices: Devices;
  dialogRef: NbDialogRef<any>;
  constructor(
    private service: ReportService,
    private utilitiesService: UtilitiesService,
    private dialogService: NbDialogService,
    private jdService: JdService,
    private toastrService: NbToastrService,
  ) {
    this.role = getRole();
    this.devices = this.utilitiesService.getDevice();
  }

  ngOnInit() {
    this.loading = true;
    this.items = [];
    this.keyword = '';
    this.paging = {
      length: 0,
      pageIndex: 0,
      pageSize: Paging.pageSizeOptions[0],
      pageSizeOptions: Paging.pageSizeOptions
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
        'refJD.position',
      ]
    }
    this.getList();
  }

  getList() {
    this.items = [];
    this.loading = true;
    this.criteria = {
      keyword: this.keyword,
      skip: (this.paging.pageIndex * this.paging.pageSize),
      limit: this.paging.pageSize
    };
    this.service.getStageList(this.criteria).subscribe(response => {
      if (response.code === ResponseCode.Success) {
        this.items = response.data;
        this.paging.length = response.totalDataSize;
        if (!this.items.length && this.paging.pageIndex > 0) {
          this.paging.pageIndex--;
          this.getList();
        }
      }
      this.loading = false;
    })
  }

  checkCV(id) {
    var name = id;
    this.jdService.originalCV(undefined, this.role._id, id)
      .subscribe(data =>
        this.downloadFile(data, name), error =>
        this.showToast('danger', 'Error Message', "can't find original CV")
      );
  }

  downloadFile(data: any, name: string) {
    if (data.type === 'image/jpeg') {
      const blob = new Blob([data], { type: "image/jpeg" });
      const url = window.URL.createObjectURL(blob);
      saveAs(url, name + ".jpeg");
      window.open(url);
    } else if (data.type === 'application/pdf') {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      saveAs(url, name + ".pdf");
      window.open(url);
    } else {
      const blob = new Blob([data], { type: "application/docx" });
      const url = window.URL.createObjectURL(blob);
      saveAs(url, name + ".docx");
      window.open(url);
    }
  }

  info(item: any) {
    setFlowId(item);
    this.dialogService.open(PopupExtractionComponent,
      {
        closeOnBackdropClick: false,
        hasScroll: true,
      }
    ).onClose.subscribe(result => {
      setFlowId();
      if (result) {
      }
    });
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
