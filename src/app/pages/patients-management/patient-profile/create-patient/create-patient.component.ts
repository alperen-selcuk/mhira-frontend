import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PatientsService } from '../../@services/patients.service';
import { Patient } from '../../@types/patient';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPermissionsService } from '@shared/services/app-permissions.service';
import { PatientCreateForm, PatientUpdateForm } from '@app/pages/patients-management/@forms/patient-form';
import { PatientModel } from '@app/pages/patients-management/@models/patient.model';
import { EmergencyContactsService } from '@app/pages/patients-management/@services/contacts.service';
import { Contact } from '@app/pages/patients-management/@types/contact';
import { PermissionKey } from '@app/@shared/@types/permission';
import { ErrorHandlerService } from '../../../../@shared/services/error-handler.service';
import { finalize } from 'rxjs/operators';
import { DepartmentsService } from '../../@services/departments.service';
import { TranslateService } from '@ngx-translate/core';
import { PatientStatusesService } from '../../@services/patient-statuses.service';

const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss'],
})
export class CreatePatientComponent implements OnInit {
  PK = PermissionKey;
  isLoading = false;
  populateForm = false;
  resetForm = false;
  loadingMessage = '';
  patientForm = PatientCreateForm;
  patientUpdateForm = PatientUpdateForm;
  patient: Patient;
  inputMode = true;
  showCancelButton = false;

  constructor(
    private patientsService: PatientsService,
    private emergencyContactsService: EmergencyContactsService,
    private message: NzMessageService,
    private errorService: ErrorHandlerService,
    private activatedRoute: ActivatedRoute,
    private departmentsService: DepartmentsService,
    private patientStatusesService: PatientStatusesService,
    private router: Router,
    private translateService: TranslateService,
    public perms: AppPermissionsService
  ) {}

  ngOnInit(): void {
    this.getPatientFromUrl();
    this.getDepartments();
    this.getPatientStatuses();
  }

  public submitForm(patientData: Patient): void {
    if (this.patient) {
      patientData.id = this.patient.id;
      this.updatePatient(patientData);
    } else {
      this.createPatient(patientData);
    }
  }

  private getPatientFromUrl(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.resetForm = false;
      this.populateForm = false;
      if (params.profile) {
        this.inputMode = false;
        this.showCancelButton = true;
        const bytes = CryptoJS.AES.decrypt(params.profile, environment.secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.patient = decryptedData;
        if (this.patient.birthDate) {
          this.patient.birthDate = decryptedData.birthDate.slice(0, 10);
        }
        this.populateForm = true;
      } else {
        this.inputMode = true;
        this.showCancelButton = false;
        this.resetForm = true;
      }
    });
  }

  private createEmergencyContacts(patientId: number, contacts: Contact[]) {
    this.isLoading = true;
    contacts.map((contact: Contact) => {
      contact.patientId = patientId;
    });
    this.emergencyContactsService
      .createManyEmergencyContacts(contacts)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loadingMessage = '';
        })
      )
      .subscribe(
        () => {
          this.populateForm = false;
          this.resetForm = true;
          this.message.success(this.translateService.instant('forms.patients.emergencyContactSuccess'));
          this.router.navigate(['/mhira/case-management/patients']);
        },
        (error) =>
          this.errorService.handleError(error, {
            prefix: this.translateService.instant('forms.patients.emergencyContactError'),
          })
      );
  }

  private createPatient(patient: Patient) {
    this.isLoading = true;
    this.resetForm = false;
    this.populateForm = false;
    const emergencyContacts = patient.emergencyContacts || [];
    patient.emergencyContacts = undefined;
    this.loadingMessage = this.translateService.instant('forms.patients.creatingPatient', { 
      firstName: patient.firstName, 
      lastName: patient.lastName 
    });
    this.patientsService
      .createPatient(patient)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        async ({ data }: any) => {
          const patientData = data.createOnePatient;
          this.message.success(this.translateService.instant('forms.patients.patientCreated'));
          if (emergencyContacts.length > 0) {
            this.createEmergencyContacts(patientData.id, emergencyContacts);
          } else {
            this.router.navigate(['/mhira/case-management/patients']);
          }
        },
        (error) =>
          this.errorService.handleError(error, {
            prefix: this.translateService.instant('forms.patients.unableToCreatePatient'),
          })
      );
  }

  private updatePatient(patient: Patient) {
    this.isLoading = true;
    this.loadingMessage = this.translateService.instant('forms.patients.updatingPatient', { 
      firstName: patient.firstName, 
      lastName: patient.lastName 
    });
    patient.emergencyContacts = undefined;
    this.patientsService
      .updatePatient(patient)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loadingMessage = '';
        })
      )
      .subscribe(
        async ({ data }) => {
          const patientData = data.updateOnePatient;
          PatientModel.fromJson(patientData);
          this.message.create('success', this.translateService.instant('forms.patients.patientUpdated'));
          this.router.navigate(['/mhira/case-management/patients']);
        },
        (error) =>
          this.errorService.handleError(error, {
            prefix: this.translateService.instant('forms.patients.unableToUpdatePatient', { 
              firstName: patient.firstName,
              lastName: patient.lastName
            }),
          })
      );
  }

  private getDepartments(): void {
    this.departmentsService
      .departments()
      .pipe(finalize(() => {}))
      .subscribe(
        ({ data }: any) => {
          // Update department options in the form
          const departmentField = this.patientForm.groups[0].fields.find(f => f.name === 'departmentIds');
          if (departmentField) {
            departmentField.options = data.departments.edges.map((dep: any) => ({
              label: dep.node.name,
              value: dep.node.id
            }));
          }
        },
        (err) => this.errorService.handleError(err, { 
          prefix: this.translateService.instant('forms.patients.unableToLoadDepartments') 
        })
      );
  }

  private getPatientStatuses(): void {
    this.patientStatusesService.patientStatuses().subscribe(({ data }: any) => {
      const statusField = this.patientForm.groups[0].fields.find(f => f.name === 'statusId');
      if (statusField) {
        statusField.options = data.patientStatuses.edges.map((e: any) => ({
          label: e.node.name,
          value: e.node.id
        }));
      }
      // Update for update form as well
      const updateStatusField = this.patientUpdateForm.groups[0].fields.find(f => f.name === 'statusId');
      if (updateStatusField) {
        updateStatusField.options = data.patientStatuses.edges.map((e: any) => ({
          label: e.node.name,
          value: e.node.id
        }));
      }
    });
  }
}
