import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { UsersService } from '../services/users.service';
import { AlertService } from './../services/alert.service';

import { User } from '../_models/user.model';
import { Role } from '../_models/roles.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  addUserForm: FormGroup;
  editUserForm: FormGroup;
  modalRef: BsModalRef;

  users: User[] = [];

  loading = false;
  submitted = false;
  selectedRole = '';
  allRoles = Role;
  suggestedIndicators = [
    'test',
    'test1',
    'test2',
    'test3',
  ];
  modalConfig = {
    keyboard: true,
    animated: true,
    class: 'custom-confirmation modal-lg'
  };
  confirmationData = {
    text: '',
    title: '',
    type: '',
    data: {},
  }
  // confirmationModalText: string = '';
  // confirmationModalTitle: string = '';
  // confirmationModalType: string = '';

  constructor(private userService: UsersService,
    private formBuilder: FormBuilder,
    private alert: AlertService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      indicators: ['']
    });
    this.editUserForm = this.formBuilder.group({
      editUserFormArray: new FormArray([
        new FormGroup({
          name: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required, , Validators.email]),
          indicators: new FormControl('')
        })
      ])
    });
    this.loadAllUsers();

  }

  // convenience getter for easy access to forms fields
  get f() { return this.addUserForm.controls; }
  get t() { return this.editUserForm.get('editUserFormArray') as FormArray; }

  // load all users
  loadAllUsers() {
    this.loading = true;
    this.showSpinner();
    this.userService.getAllUsers()
      .subscribe(
        data => {
          this.users = data.data.map((user, i) => {
            user.isCollapsed = (user.role !== this.allRoles.assesor) ? true : false;
            user.isEditing = false;
            // this.t.push(this.formBuilder.group({
            //   name:  ['', Validators.required],
            //   email: ['', [Validators.required, Validators.email]]
            // }));
            return user;
          });
          for (let i = this.t.length; i < data.data; i++) {

          }

          this.loading = false;
          this.hideSpinner();
        },
        error => {
          this.alert.error(error);
          this.loading = false;
          this.hideSpinner();
        });
  }


  // change between roles
  selectRole(role) {
    this.selectedRole = role;
    this.resetForm();
  }

  //add new user
  addUser() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addUserForm.invalid) {
      this.alert.error('Please verify incorrect fields');
      return;
    }
    let newUserData = {
      "username": (this.f.username) ? this.f.username.value : this.f.name.value,
      "password": "12345678",
      "role": this.selectedRole,
      "name": this.f.name.value,
      "email": this.f.email.value,
      "indicators": (this.f.indicators) ? this.f.indicators.value : null
    }
    this.loading = true;
    this.showSpinner();
    this.userService.createUser(newUserData)
      .subscribe(
        data => {
          this.submitted = false;
          this.alert.success(data.message);
          this.loading = false;
          this.addUserForm.reset();
          this.loadAllUsers();
          this.hideSpinner();
        },
        error => {
          this.hideSpinner();
          this.alert.error(error);
          this.loading = false;
        });


  }

  //delete current user
  deleteUser(id: string) {
    this.loading = true;
    this.showSpinner();

    this.userService.deleteUser(id)
      .subscribe(
        data => {
          this.alert.success(data.message);
          this.loading = false;
          this.hideSpinner();
          this.loadAllUsers();
        },
        error => {
          this.alert.error(error);
          this.loading = false;
          this.hideSpinner();
        });
  }

  //save edited users
  editUser(user) {
    user.isEditing = !user.isEditing;
    user.isCollapsed = false;
    let editUserData = {
      // "username": (this.g.username) ? this.g.username.value : this.g.name.value,
      // "role": user.role,
      // "name": this.g.name.value,
      // "email": this.g.email.value || user.email,
      // "indicators": (this.g.indicators) ? this.g.indicators.value : null
    }
    // this.showSpinner();


    console.log(editUserData)

    // 

  }



  //reset forms and field validations
  resetForm() {
    this.addUserForm.reset();
    this.addUserForm.controls.name.setErrors(null);
    this.addUserForm.controls.email.setErrors(null);
    this.addUserForm.controls.indicators.setErrors(null);
    this.addUserForm.updateValueAndValidity();
  }

  /**
   * 
   * MODAL
   */

  //confirmation logic
  openModal(template: TemplateRef<any>, type: string, data: any) {
    this.confirmationData.type = type;
    this.confirmationData.data = data;
    switch (type) {
      case 'delete':
        this.confirmationData.text = `Are you sure of deleting ${data.name}?`;
        this.confirmationData.title = `Delete User ${data.role}`;
        break;
      case 'edit':
        this.confirmationData.text = `Confirm changes?`;
        this.confirmationData.title = `Edit User ${data.name}`;
        break;
      default:
        break;
    }
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  confirm(confirmData: any): void {
    switch (confirmData.type) {
      case 'delete':
        this.deleteUser(confirmData.data.id)
        break;
      case 'edit':
        this.editUser(confirmData.data)
        break;

      default:
        break;
    }
    // this.message = 'Confirmed!';
    this.modalRef.hide();
  }

  decline(): void {
    // this.message = 'Declined!';
    this.modalRef.hide();
  }


  /**
  * 
  * SPINNER
  */


  // spinner
  showSpinner() {
    this.spinner.show(undefined,
      {
        fullScreen: true,
        type: "ball-clip-rotate-multiple"
      }
    );
  }
  hideSpinner() {
    this.spinner.hide();
  }

}
