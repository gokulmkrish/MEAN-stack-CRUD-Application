import { SnackbarcompComponent } from './../../shared/snackbarcomp/snackbarcomp.component';
import { MatSnackBar } from '@angular/material';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading=false;
  submitted=false;
  returnurl:string;

  constructor(
    private fbuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = this.fbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.auth.logout();
    this.returnurl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { 
    return this.loginForm.controls;
  }

  onsubmit() {
    console.log("clieckd");
    this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
      this.loading = true;
      this.auth.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if(data.token){
            this.router.navigate([this.returnurl]);
            this._snackBar.openFromComponent(SnackbarcompComponent, {
              duration: 2 * 1000,
              data: {message:"Login Successful", type:"success"}
            });
          }
          else {
              this._snackBar.openFromComponent(SnackbarcompComponent, {
                duration: 2 * 1000,
                data: {message:"Incorrect Login", type:"error"}
              });
          }
        },
        error => {
            //this.alert.error(error);
            this.loading = false;
        }
      );
  }
}
