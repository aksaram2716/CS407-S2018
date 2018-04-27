import { Routes } from '@angular/router';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { FormLayoutComponent } from './form-layouts/form-layout.component';
import { EditorComponent } from './editor/editor.component';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { UploadComponent } from './file-upload/upload.component';
import { WizardComponent } from './wizard/wizard.component'; 

export const FormRoutes: Routes = [
  { 
    path: '',
    children: [{
      path: 'autocomplete', 
      component: AutocompleteComponent
    }, {
      path: 'checkbox',
      component: CheckboxComponent
    }, {
      path: 'datepicker',
      component: DatepickerComponent
    }, {
      path: 'form-layout',
      component: FormLayoutComponent
    }, {
      path: 'editor',
      component: EditorComponent
    }, {
      path: 'form-validation',
      component: FormValidationComponent
    }, {
      path: 'file-upload',
      component: UploadComponent
    }, {
      path: 'wizard',
      component: WizardComponent
    }]
  }
];
