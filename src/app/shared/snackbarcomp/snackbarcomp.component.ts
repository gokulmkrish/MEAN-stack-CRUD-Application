import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `<span class="{{data.type}}">
  {{data.message}}
  </span>`,
  styles: [`
    .success {
      color: white;
    }
    .error {
      color: red;
    }
    .mat-snack-bar-container {
      backgroud-color:#2f3dd1;
      text-align:center;
    }
  `],
})
export class SnackbarcompComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data
  ){}

}
