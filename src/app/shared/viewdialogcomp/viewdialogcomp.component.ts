import { SnackbarcompComponent } from './../snackbarcomp/snackbarcomp.component';
import { EmpService } from 'src/app/_services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewdialogcomp',
  templateUrl: './viewdialogcomp.component.html',
  styleUrls: ['./viewdialogcomp.component.css']
})
export class ViewdialogcompComponent{

  statuss = [
    { value: "enabled", viewValue: "Active"},
    { value:"disabled", viewValue:"Disabled"}
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewdialogcompComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    private empserve: EmpService, 
    private _snackBar: MatSnackBar, 
    private router: Router) {
      if(!data.emp._id){
        this.data.emp ={
          name: "",
          empid: "",
          email: "",
          phoneno: "",
          role: "",
          status: "active",
          usertype: "employee"
        };
      }
      console.log(data.emp);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message) {
    this._snackBar.openFromComponent(SnackbarcompComponent, {
      duration: 2 * 1000,
      data: message
    });
  }

  saveemp() {
    console.log(this.data.emp);
    if(this.data.emp._id){
      this.empserve.updateemp(this.data.emp).subscribe(
        res => {if(res){
          console.log("User created\n", res);
          this.router.navigate(['/']);
          this.openSnackBar({"message":"Employee Updated Succesfully", "type":"success"});
        }else{
          this.openSnackBar({"message":"Problem in Employee Updation", "type":"error" });
        }
        })
    } else {
      this.empserve.createemp(this.data.emp).subscribe(
        res => { if(res){
          this.data = res;
          console.log("User created\n", res);
          this.openSnackBar({"message":"Employee Created Succesfully", "type":"success"});
        }else{
          this.openSnackBar({"message":"Problem in Employee Creation", "type":"error"});
        }
        }
      )
    }
    console.log("new form save requested");
    this.onNoClick();
  }

}
