import { LazyLoadEvent } from 'primeng/api';
import { async } from '@angular/core/testing';
import { Observable, Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, SecurityContext } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  @Input() itemlist: any[];
  @Input() totalRecords: Number;
  @Input() saveResponce: Observable<any>;
  clonedItem: any = {};
  private eventsSubscription: Subscription;


  @Output() onSearchClick = new EventEmitter<any>();
  @Output() onSaveClick = new EventEmitter<any>();


  searchBy: { name: string; description: string } = {
    name: "",
    description: "",
  };

  rows: number = 15;
  loading: boolean;

  table: any;
  saveIndex: number;
  saveItem: any;


  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    //this.onSaveClick.subscribe(() => this.afterSave());

    this.eventsSubscription = this.saveResponce.subscribe((a) => this.afterSave(a));

  }

  search = async () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loading = true;
    await this.onSearchClick.emit({ rows: event.rows, first: event.first, searchBy: this.searchBy });
    this.loading = false;

  };

  loadItem = async (event: LazyLoadEvent) => {
    this.loading = true;
    await this.onSearchClick.emit({ rows: event.rows, first: event.first, searchBy: this.searchBy });
    this.loading = false;
  }

  /**
  * on enable row edit
  * @param sector
  */
  onRowEditInit(item: any) {
    console.log(item);

    this.clonedItem[item.id] = { ...item };
  }

  /**
   * on save button click
   * @param sector
   */
  async onRowEditSave(item: any, table: any, index: number) {
    if (!item.name) {
      return false;
    }
    this.loading = true;
    this.saveIndex = index;
    this.table = table;
    this.saveItem = item;
    await this.onSaveClick.emit(item);


    this.loading = false;

  }

  afterSave(saveResponce: any) {
    console.log(saveResponce);

    if (saveResponce != null && saveResponce != undefined) {
      if (saveResponce && saveResponce.id) {
        delete this.clonedItem[this.saveItem.id];
        alert("Successfully Saved.");
        this.search();
      } else if (saveResponce && saveResponce.status === 409) {
        this.table.initRowEdit(this.itemlist[this.saveIndex]);
        alert("Name already exist.");
      }
      this.loading = false;
    }
  }

  /**
   * on cancel button click
   * @param sector
   * @param index
   */
  onRowEditCancel(item: any, index: number) {
    if (item.id === 0) {
      this.itemlist.splice(0, 1);
    } else {
      this.itemlist[index] = this.clonedItem[item.id];
    }
    delete this.clonedItem[item.id];
  }

  /**
   * on add button click
   * @param table
   */
  onAddButtonClick = (table: any) => {
    if (this.itemlist.length > 0 && this.itemlist[0].id === 0) {
      this.itemlist[0].name = "";
      this.itemlist[0].description = "";
    } else {
      let item: { id: number, sortOrder: number, status: number, name: string, description: string } = { id: 0, sortOrder: 1, status: 0, name: "", description: "" };

      this.itemlist.unshift(item);
      this.onRowEditInit(this.itemlist[0]);
      table.initRowEdit(this.itemlist[0]);
    }
  };

  inputEvent(item) {

    //console.log(" inputEvent item :",this.sanitizer.sanitize(SecurityContext.SCRIPT,item.name));

    
      item["invalidInput"] = ! /^[a-zA-Z0-9  ,-.]{1,256}$/.test(item.name)
      item["invalidInputDes"] = ! /^[a-zA-Z0-9  ,-.]{1,256}$/.test(item.description)
    

  }

}
