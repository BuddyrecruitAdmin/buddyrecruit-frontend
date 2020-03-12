import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { getRole, getAllListName, getAllList } from '../../shared/services/auth.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
@Component({
  selector: 'ngx-popup-search-dropdown',
  templateUrl: './popup-search-dropdown.component.html',
  styleUrls: ['./popup-search-dropdown.component.scss']
})
export class PopupSearchDropdownComponent implements OnInit {
  listAll: any;
  name: any;
  selected: any;
  term: any;
  constructor(
    public ref: NbDialogRef<PopupSearchDropdownComponent>,
  ) {
    this.name = getAllListName();
    this.listAll = getAllList();
  }

  ngOnInit() {
    this.selected = '';
    this.listAll.splice(0, 1);
    console.log(this.listAll)
    this.listAll.map(element => {
      element.checked = false;
    });
  }

  selectItem(item) {
    item.checked = !item.checked;
    if (item.checked === true) {
      this.listAll.forEach(element => {
        if (element.value != item.value) {
          element.checked = false;
        }
      });
    }
    this.selected = item;
  }

  save() {
    this.ref.close(this.selected)
  }
}
