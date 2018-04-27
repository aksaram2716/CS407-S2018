import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormRoutes } from './forms.routing';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';


import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { FormLayoutComponent } from './form-layouts/form-layout.component';
import { EditorComponent } from './editor/editor.component';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { UploadComponent } from './file-upload/upload.component';
import { WizardComponent } from './wizard/wizard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FormRoutes),
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    QuillModule,
    ReactiveFormsModule,
    FileUploadModule
   ],
  declarations: [
    AutocompleteComponent,
    CheckboxComponent,
    DatepickerComponent,
    FormLayoutComponent,
    EditorComponent,
    FormValidationComponent,
    UploadComponent,
    WizardComponent
  ],
})

export class FormModule {}
