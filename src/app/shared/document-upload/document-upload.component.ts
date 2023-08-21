import { async } from '@angular/core/testing';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Documents, DocumentsDocumentOwner, DocumentControllerServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit, OnChanges {


  @Input() doucmentList: Documents[];
  @Input() documentOwner: DocumentsDocumentOwner;
  @Input() documentOwnerId: number;
  @Input() isNew: boolean;
  @Input() showDeleteButton: boolean;
  @Input() showUpload: boolean = true;


  loading: boolean;
  uploadedFiles: any[] = [];
  SERVER_URL = environment.baseUrlAPIDocUploadAPI; //"http://localhost:7080/document/upload2";
  uploadURL: string;

  constructor(private docService: DocumentControllerServiceProxy, private httpClient: HttpClient,
    private confirmationService: ConfirmationService) {
    // this.showDeleteButton = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.documentOwner) {
      this.uploadURL = this.SERVER_URL + "/" + this.documentOwnerId + "/" + this.documentOwner.toString();
    }
    this.load();
  }

  ngOnInit(): void {
    if (this.documentOwner) {
      this.uploadURL = this.SERVER_URL + "/" + this.documentOwnerId + "/" + this.documentOwner.toString();
    }

    console.log("============" + this.showDeleteButton + "==============")
  }

  loadDocments(event: LazyLoadEvent) {
    this.load();
  }

  async load() {
    if (!this.isNew) {
      this.loading = true;
      await this.docService.getDocuments(this.documentOwnerId, this.documentOwner).subscribe((res) => {
        this.doucmentList = res;
        this.loading = false;
      }, (err) => console.log(err))
    }
  }

  onUploadComplete(event) {
    console.log(event);
    this.load();
  }

  myUploader(event) {
    if (this.doucmentList === undefined || this.doucmentList === null) {
      this.doucmentList = new Array();
    }
    let fileReader = new FileReader();

    for (let file of event.files) {
      file.documentOwner = this.documentOwner;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentOwner', this.documentOwner.toString());
      let fullUrl = this.SERVER_URL + "/" + this.documentOwnerId + "/" + this.documentOwner.toString();
      this.httpClient.post<any>(fullUrl, formData).subscribe(
        (res) => { this.load(); },
        (err) => console.log(err)
      );
    }
  }

  async deleteConfirm(doc: Documents) {
    this.confirmationService.confirm({
      message: `Do you want to delete ${doc.fileName} ?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.docService.deleteDoc(doc.id).subscribe(async (res) => {
          await this.load();
        }, (err) => console.log(err))
      },
      reject: () => {
        //this.messageService.add({severity:'info', summary:'Rejected', detail:'You have rejected'});
      }
    });
  }

  base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onUpload(event) {
    alert("test");
  }

  onError(error) {
    console.log(error.error);
    if(error.error.error.ex.response){
      alert(error.error.error.ex.response);
    } else {
      alert("File uploading error, try again.")
    }
    
  }


}
