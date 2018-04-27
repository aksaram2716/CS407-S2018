import {AfterViewInit, Component} from '@angular/core';
import {JustRecipesAPIService} from '../services/api.service';
import {User} from '../../interfaces/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements AfterViewInit {
  panelOpenState: boolean = false;
  headers: string[];
  step = 0;
  currentUser: User = {
    id: 0,
    firstname: '',
    lastname: '',
    profile_image: '',
    joined: ''
  };
  fileToUpload: File = null;
  current_password = '';
  new_password: '';

  constructor(private _justRecipesAPIService: JustRecipesAPIService) {}

  ngAfterViewInit() {
    this.showProfile();
  }

  showProfile() {
    this._justRecipesAPIService.getMyProfile()
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `Recipe`.
        // get object
        this.currentUser = resp.body;
        // alert(JSON.stringify(this.recipe));
      });
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.currentUser.profile_image = this.getBase64(this.fileToUpload);
  }

  selectImage() {
    document.getElementById('input-image').click();
  }

  getBase64(file: File): string {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      return reader.result;
    };
    reader.onerror = function (error) {
      return '';
    };
    return '';
  }

  saveProfile() {
    this._justRecipesAPIService.saveMyProfile(
      this.currentUser.firstname,
      this.currentUser.lastname,
      this.currentUser.profile_image
    )
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
      });

    this._justRecipesAPIService.changePassword(
      this.current_password,
      this.new_password
    )
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
      });
  }
}
