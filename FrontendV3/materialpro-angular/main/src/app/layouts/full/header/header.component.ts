import {AfterViewInit, Component, Inject} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {JustRecipesAPIService} from '../../../services/api.service';
import {User} from '../../../../interfaces/User';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent implements AfterViewInit {
    public config: PerfectScrollbarConfigInterface = {};
    // This is for Notifications
    notifications: Object[] = [{
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    }, {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    }, {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    }, {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }];
    isUserLoggedIn = false;
    currentUser: User = {
      id: 0,
      firstname: '',
      lastname: '',
      profile_image: '',
      joined: ''
    };
    feedbackText = '';
    headers: string[];

    constructor(
      private _justRecipesAPIService: JustRecipesAPIService,
      private router: Router,
      public dialog: MatDialog,
    ) {}

  ngAfterViewInit() {
    this.isUserLoggedIn = this._justRecipesAPIService.userIsLoggedIn();
    this.currentUser = this._justRecipesAPIService.getProfileFromLocalStorage();
  }

  goLogin() {
    this.router.navigate(['authentication/login']);
  }

  goSettings() {
    this.router.navigate(['settings']);
  }

  goProfile() {
    this.router.navigate(['profile']);
  }

  goFavorites() {
    this.router.navigate(['favorites']);
  }

  logout() {
      this._justRecipesAPIService.clearCredentials();
    this.router.navigate(['home'], {
      queryParams: {
        q: ''
      }
    });
  }

  writeFeedback() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '250px',
      data: { firstname: this.currentUser.firstname, feedbackText: this.feedbackText }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.feedbackText = result;

      this._justRecipesAPIService.getFeedbackResponse(this.feedbackText)
        .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);
      });
    });
  }
}

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: 'feedback.dialog.html',
})
export class FeedbackDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
