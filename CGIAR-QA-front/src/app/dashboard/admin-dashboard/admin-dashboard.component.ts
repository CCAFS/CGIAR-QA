import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  programsForm = this.formBuilder.group({
    program: ['male']
  })

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }
  

  onProgramChange({ target }, value) {
    console.log(target.value, value);
  }

}
