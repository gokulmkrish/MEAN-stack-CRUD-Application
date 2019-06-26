import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmpService {

  constructor(private http:HttpClient) { }

  getallemp(){
    return this.http.get('/api/employee/retrive').pipe(map(
      res => {
        return res;
      }
    ));
  }

  deleteemp( empid:string ){
    console.log("serviceis called")
    return this.http.delete('/api/employee/delete/'+empid).pipe(map(
      res => {
        return res;
      }
    ));
  }
  createemp(data){
    return this.http.post('/api/employee/create', data).pipe(map(
      res => {
        return res;
      }
    ))
  }

  updateemp(data){
    return this.http.put('/api/employee/update', data).pipe(map(
      res => {
        return res;
      }
    ))
  }
}
