import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from './../services/authentication.service';
import { AlertService } from './../services/alert.service';

import { GeneralStatus } from '../_models/general-status.model';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  env = environment;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.config.length) {
            if (data.config[0].status === GeneralStatus.Open) {
              console.log(`dashboard/${data.roles[0].description.toLowerCase()}`)
              this.router.navigate([`dashboard/${data.roles[0].description.toLowerCase()}`]);
            } else {
              this.router.navigate([`qa-close`]);
            }
          } else {
            this.router.navigate([`qa-close`]);
          }

          // this.router.navigate([`dashboard/${data.roles[0].description.toLowerCase()}`]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
