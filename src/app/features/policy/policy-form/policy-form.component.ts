import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClimateChangeDataCategory, Documents, DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, Policy, Sector, ServiceProxy, AppControllerServiceProxy, User } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AlertType } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class PolicyFormComponent implements OnInit {

  isNew: boolean = true;
  policy: Policy = new Policy();
  policyId: number;
  climateChangeDataCategories: ClimateChangeDataCategory[];
  sectors: Sector[];
  proposedDate: Date;

  documentList: Documents[] = new Array();
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.Policy;
  documentsDocumentOwnerId: number = 2;

  institutionList: Institution[] = [];

  alertHeader: string = "Policy";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  isSaving: boolean = false;

  exsistingPolicy: boolean = false;
  policyList: Policy[];
  relatedItem: Policy[];

  treeDataCCD: TreeNode[];
  selectedtreeDataCCD: TreeNode[];
  isvalidCCdSector: boolean = true;

  loginUser: User;


  constructor(private serviceProxy: ServiceProxy,
    private masterDataService: MasterdataControllerServiceProxy,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, private appService: AppControllerServiceProxy
  ) { }

  async ngOnInit(): Promise<void> {

    this.appService.getUserInfo().subscribe(user => {
      this.loginUser = user;
    });

    this.loadDropDownData();

    await this.serviceProxy.getManyBasePolicyControllerPolicy(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.policyList = res.data;
        // console.log("this.allInstitutions", this.allInstitutions);
      });


    this.route.queryParams.subscribe(params => {
      this.policyId = params['id'];
      if (this.policyId && this.policyId > 0) {
        this.isNew = false;
        this.loadPolicyDataOnUpdate(this.policyId);
      } else {
        this.policy = new Policy();
        this.policy.influence = 1;
      }
    });
  }

  onnameKeyDown(event: any) {
    console.log("============= Event ===============");

    let skipWord = ["of", "the", "in", "On", "-", "_", "/"];
    let searchText = this.removeFromString(skipWord, this.policy.name).trim();


    if (!searchText || searchText?.length < 4) {
      console.log("========== Return");
      this.relatedItem = null;
      return;
    }

    let words = searchText.split(" ");

    let orfilter: string[] = new Array();
    for (const w of words) {
      orfilter.push('name||$cont||' + w.trim())
    }



    this.serviceProxy.getManyBasePolicyControllerPolicy(undefined,
      undefined,
      undefined,
      orfilter,
      undefined,
      undefined,
      10, 0, 0, 0).subscribe(res => {
        console.log(res);
        if (this.policy.name) {
          this.relatedItem = res.data;
          //console.log(this.relatedParam)
        }
      });
  }

  escape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  removeFromString(arr, str) {
    let escapedArr = arr.map(v => escape(v))
    let regex = new RegExp("(?:^|\\s)" + escapedArr.join('|') + "(?!\\S)", "gi")
    return str.replace(regex, '')
  }

  nameChange() {

    if (this.policy.name.length > 0) {

      let insTemp = this.policyList.find(a => a.name == this.policy.name);
      if (insTemp && insTemp.id != this.policy.id) {
        this.exsistingPolicy = true;
      }
      else {
        this.exsistingPolicy = false;
      }
    }

    //console.log("this.exsistingInstitution", this.exsistingInstitution, this.institution.name);


  }

  onChangeCCD() {
    // this.masterDataService.getAllSectorByCCDataCatagary(this.policy.climateChangeDataCategory.id).subscribe(res => {
    //   this.sectors = res;
    // });
  }

  onNodeUnSelect(event: any) {
    console.log(event.node)
    this.isCCDSelect();

  }

  onNodeSelect(event: any) {
    console.log(event.node)
    this.isCCDSelect();

  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  /**
   * load dropdown data on init
   */
  loadDropDownData = async () => {
    // this.masterDataService.getAllSector().subscribe(res => {
    //   this.sectors = res;
    // });

    this.masterDataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategories = res;
      this.treeDataCCD = this.populateTreeNode(res);
    });

    //institutions
    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutionList = res.data;
        this.setInstitution();
      });
  }

  populateTreeNode(ccDataCatgaries: ClimateChangeDataCategory[]) {
    let nodes: TreeNode[] = new Array();

    for (const c of ccDataCatgaries) {
      let childnodes: TreeNode[] = new Array();

      for (const s of c.sectors) {
        let child: TreeNode = { label: s.name, data: s, expanded: true };
        childnodes.push(child);
      }

      let parentNode: TreeNode = { label: c.name, data: c, children: childnodes, expanded: false };
      nodes.push(parentNode);


    }


    return nodes;
  }

  /**
   * load policy data on update mode
   * @param policyId 
   */
  loadPolicyDataOnUpdate = async (policyId: number) => {
    this.serviceProxy.getOneBasePolicyControllerPolicy(policyId, undefined, undefined, 0).subscribe(res => {
      this.policy = res;
      this.proposedDate = new Date(this.policy.proposedDateOfCommence.toISOString());
      this.setInstitution();
      this.onChangeCCD();
      this.setTreeSelection();
    });
  }

  setTreeSelection() {
    this.selectedtreeDataCCD = new Array();
    for (const t of this.treeDataCCD) {

      if (this.policy.climateChangeDataCategory) {
        if (this.policy.climateChangeDataCategory.find(a => a.id == t.data.id)) {
          this.selectedtreeDataCCD.push(t);
        }
      }

      if (this.policy.sector) {
        for (const c of t.children)
          if (this.policy.sector.find(a => a.id == c.data.id)) {
            this.selectedtreeDataCCD.push(c);
          }
      }

    }
  }

  /**
   * set institution object
   */
  setInstitution() {
    if (this.institutionList && this.institutionList.length > 0 && this.policy.id > 0) {
      this.policy.formulationInstitution = this.institutionList.find(obj => obj.id === this.policy.formulationInstitution.id);
    }
  }

  isCCDSelect() {
    this.isvalidCCdSector = true;
    console.log(this.selectedtreeDataCCD);

    if (!this.selectedtreeDataCCD || this.selectedtreeDataCCD.length == 0) {
      this.isvalidCCdSector = false;
    }
  }
  /**
   * save policy
   * @param formData 
   */
  saveForm(formData: NgForm) {

    this.isSaving = true;
    this.isCCDSelect();

    if (formData.valid && this.isvalidCCdSector) {
      this.policy.proposedDateOfCommence = moment(this.proposedDate, "YYYY-MM-DDTHH:mm:ssZ");

      this.policy.climateChangeDataCategory = new Array();
      this.policy.sector = new Array();

      for (const i of this.selectedtreeDataCCD) {
        //ccd
        if (!i.parent && i.data) {
          var parent = this.policy.climateChangeDataCategory.find(a => a.id == i.data.id)
          if (!parent) {
            this.policy.climateChangeDataCategory.push(i.data);
          }
        }
        else {
          //sector
          this.policy.sector.push(i.data);
          var parent = this.policy.climateChangeDataCategory.find(a => a.id == i.parent.data.id)
          if (!parent) {
            this.policy.climateChangeDataCategory.push(i.parent.data);
          }

        }
      }


      let insTemp = this.policy.formulationInstitution
      this.policy.formulationInstitution = new Institution();
      this.policy.formulationInstitution.id = insTemp.id;
      this.policy.isPendingApprove = true;

      if (this.isNew) {
        // create 
        this.serviceProxy.createOneBasePolicyControllerPolicy(this.policy).subscribe(res => {
          //alert("Created successfully!");
          //this.DisplayAlert('Created successfully!', AlertType.Message);

          this.confirmationService.confirm({
            message: 'Policy is successfully added!',
            header: 'Save',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              this.router.navigate(['/policy'], { queryParams: { id: res.id } });
            },
            reject: () => {

            },
          });


        }, error => {
          // alert("An error occurred, please try again.")
          // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
          this.isSaving = false;

          this.confirmationService.confirm({
            message: 'An error occurred, please try again.',
            header: 'Error',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              //this.onBackClick();
            },
            reject: () => {

            },
          });

          console.log("Error", error);
        });
      } else {
        //update 
        this.updatePolicy();
      }

    }
    else {
      this.isSaving = false;

    }
  }

  updatePolicy() {
    this.serviceProxy.updateOneBasePolicyControllerPolicy(this.policy.id, this.policy).subscribe(res => {
      // alert("Successfully Saved!");
      // this.DisplayAlert('Successfully Saved!', AlertType.Message);

      this.confirmationService.confirm({
        message: 'Policy is successfully updated!',
        header: 'Save',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        rejectButtonStyleClass: 'p-button-text',
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
          this.onBackClick();
        },
        reject: () => {

        },
      });

      // this.onBackClick();
    }, error => {
      // alert("An error occurred, please try again.")
      // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
      this.isSaving = false;

      this.confirmationService.confirm({
        message: 'An error occurred, please try again.',
        header: 'Error',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        rejectButtonStyleClass: 'p-button-text',
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
          //this.onBackClick();
        },
        reject: () => {

        },
      });

      console.log("Error", error);
    });
  }

  onBackClick() {
    this.router.navigate(['/policy-list']);
  }

  onApproveClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve the policy?',
      header: 'Approve Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.policy.isPendingApprove = false;
        this.updatePolicy();
      },
      reject: () => {

      },
    });
  }

  onApprove() {

  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the policy?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deletePolicy();
      },
      reject: () => {

      },
    });
  }

  deletePolicy = () => {
    this.serviceProxy.deleteOneBasePolicyControllerPolicy(this.policyId).subscribe(res => {
      //alert("Deleted successfully.");
      // this.DisplayAlert('Deleted successfully.', AlertType.Message);

      this.confirmationService.confirm({
        message: 'Deleted successfully.',
        header: 'Delete',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        rejectButtonStyleClass: 'p-button-text',
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
          this.onBackClick();
        },
        reject: () => {

        },
      });

      // this.onBackClick();
    });
  }


}
