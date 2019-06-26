import { SnackbarcompComponent } from './../../shared/snackbarcomp/snackbarcomp.component';
import { ViewdialogcompComponent } from './../../shared/viewdialogcomp/viewdialogcomp.component';
import { employee } from './../../_model/empmodel';
import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatPaginator, MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { EmpService } from 'src/app/_services/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  constructor(private empservice: EmpService, public dialog: MatDialog,
  private _snackBar: MatSnackBar) { }

  public emplist = new MatTableDataSource<employee>();


  public columnheader = ['empid', 'name', 'status', 'role', 'email', 'phoneno', 'actions'];

  ngOnInit() {
    this.getallemps();
  }

  ngAfterViewInit(): void {
    console.log("this page");
    this.emplist.sort = this.sort;
    this.emplist.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.emplist.filter = value.trim().toLocaleLowerCase();
  }

  openDialog(empData): void {
    const dialogRef = this.dialog.open(ViewdialogcompComponent, {
      width: '40%',
      data: {emp: empData }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      return result;
    });
  }

  getallemps() {
    this.empservice.getallemp().subscribe(
      res => {
        this.emplist.data = res as employee[];
        console.log(this.emplist.data);
      }
    )
    console.log(this.emplist.data);
  }
  openSnackBar(message) {
    this._snackBar.openFromComponent(SnackbarcompComponent, {
      duration: 2 * 1000,
      data: message
    });
  }

  createemp() {
    let data = { emp :{
      empid:'',
      name:'',
      status:'',
      role:'',
      email:'',
      phoneno:''
    }}
    this.openDialog(data);
    console.log("afterdone", data);
    this.getallemps();
  }

  viewemp(emp: any) {
    this.openDialog(emp);
  }

  deleteemp(emp: any) {
    console.log("delete is clicked", emp._id);
    this.empservice.deleteemp(emp._id).subscribe(res=>{
      if(res){
        this.emplist.data = this.emplist.data.filter( item => item.empid != emp.empid);
        this.openSnackBar({"message":"Employee Deleted Succesfully", "type":"success"});
      }else{
        this.openSnackBar({"message":"unable to Delete the Employee", "type":"error"});
      }
    });
  }
}
