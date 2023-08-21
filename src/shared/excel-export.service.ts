import { Injectable } from '@angular/core';
import { utils as XLSXUtils, writeFile } from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx/types';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  fileExtension = '.xlsx';

  constructor() { }

  public exportAsExcel({data, fileName, sheetName, columnOptions, autoColumnWidth}: IExportAsExcelProps): void {

    let headerKeys = columnOptions.map(obj => obj.key);
    let exportData = this.getExportData(data, headerKeys, columnOptions);

    const ws: WorkSheet = XLSXUtils.json_to_sheet(exportData.data, { header: headerKeys });
    this.setColumnProps(ws, columnOptions);

    if(autoColumnWidth){
      ws['!cols'] = exportData.columnProps;
    }    

    let wb: WorkBook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, sheetName);

    writeFile(wb, `${fileName}${this.fileExtension}`);
  }

  private getExportData = (data: any[], headerKeys: string[], columnOptions: IColumnProps[]) => {
    let result = {
      data: [],
      columnProps: []
    };

    let dataList = [];

    let columnWidths = {};
    for(let obj of columnOptions){
      columnWidths[obj.key] = {wch: obj.headerText.length + 1};
    }

    for(let obj of data){
      let props = {};
      for(let index = 0; index < headerKeys.length; index++){
        let key = headerKeys[index];

        //format values
        if(columnOptions[index].type === "date" && columnOptions[index].dateFormat){

          let val = moment(new Date(obj[key])).format(columnOptions[index].dateFormat);
          props[key] = val;

        }else if(columnOptions[index].type === "number" && columnOptions[index].decimalPoints){

          let val = obj[key];
          if(typeof obj[key] === "number"){
            val = obj[key].toFixed(columnOptions[index].decimalPoints);
          }else if(!isNaN(obj[key])){
            val = Number(obj[key]).toFixed(columnOptions[index].decimalPoints);
          }  
          props[key] = val; 

        }else if(typeof obj[key] === "boolean"){
          props[key] = obj[key] ? "Yes" : "No"
        }else{
          props[key] = obj[key];
        }  
        
        //set cell widths
        if(columnWidths[key].wch < (props[key] ? (props[key].length + 1) : 0)){
          columnWidths[key].wch = props[key].length + 1;
        }
      }
      dataList.push(props);
    }

    result.data = dataList;
    result.columnProps = Object.keys(columnWidths).map(key => columnWidths[key]);

    return result;
  }

  setColumnProps = (ws: WorkSheet, columnOptions: IColumnProps[]) => {

    const excelCols = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let index = 0;
    for(let colOption of columnOptions){
      ws[`${excelCols[index]}1`].v = colOption.headerText;
      index++;
    }
  }
}

export interface IExportAsExcelProps {
  readonly data: any[];
  readonly fileName: string;
  readonly sheetName: string;
  readonly columnOptions: IColumnProps[];
  readonly autoColumnWidth?: boolean;
}

export interface IColumnProps {
  readonly key: string;
  readonly headerText: string;
  readonly type?: ExcelColumnType;
  readonly dateFormat?: string;
  readonly decimalPoints?: number;
}

type ExcelColumnType = "date" | "number" | "string" | "boolean"
