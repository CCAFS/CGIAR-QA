import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  loading = false;
  submitted = false;
  selectedRole = '';
  allRoles = Role;
  users: User[] = [];
  suggestedIndicators = [
    'test',
    'test1',
    'test2',
    'test3',
  ]

  constructor(private userService: UsersService, private formBuilder: FormBuilder, private alert: AlertService) { }

  ngOnInit() {
    this.loadAllUsers();
    this.addUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      indicators: ['']
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.addUserForm.controls; }

  loadAllUsers() {
    this.userService.getAllUsers()
      .subscribe(
        data => {
          this.users = data
        },
        error => {
          this.alert.error(error);
          this.loading = false;
        });
  }

  selectRole(role) {
    this.selectedRole = role;
  }

  addUser() {
    this.submitted = true;

    // reset alerts on submit
    this.alert.clear();

    // stop here if form is invalid
    console.log(this.f)
    if (this.addUserForm.invalid) {
      this.alert.error('Please verify incorrect fields');
      return;
    }
    let newUserData = {
      "username": this.f.username.value,
      "password": "12345678",
      "role":  this.selectedRole,
      "name":  this.f.name.value,
      "email":  this.f.email.value,
      "indicators":  this.f.indicators.value
    }


  }

}
