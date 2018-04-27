import {AfterViewInit, Component} from '@angular/core';
import {Settings} from '../../interfaces/Settings';
import {JustRecipesAPIService} from '../services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements AfterViewInit {
  headers: string[];
  settings = <Settings>{
    web_notification_enabled: false,
    email_notification_enabled: false,
    search_history_enabled: false,
    last_modified: ''
  };
  color = 'accent';
  disabled = false;

  constructor(private _justRecipesAPIService: JustRecipesAPIService) { }

  ngAfterViewInit() {
    this.showSettings();
  }

  showSettings() {
    this._justRecipesAPIService.getMySettingsRespone()
    // resp is of type `HttpResponse<Recipe>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `Recipe`.
        // get object
        this.settings = resp.body;
      });
  }

  onWebNotificationChange(e: any) {
    if (e.checked === true) {
      this.settings.web_notification_enabled = true;
    } else {
      this.settings.web_notification_enabled = false;
    }
  }

  onEmailNotificationChange(e: any) {
    if (e.checked === true) {
      this.settings.email_notification_enabled = true;
    } else {
      this.settings.email_notification_enabled = false;
    }
  }

  onSearchHistoryChange(e: any) {
    if (e.checked === true) {
      this.settings.search_history_enabled = true;
    } else {
      this.settings.search_history_enabled = false;
    }
  }

  saveSettings() {
    this._justRecipesAPIService.saveMySettingsRespone(
      this.settings.web_notification_enabled,
      this.settings.email_notification_enabled,
      this.settings.search_history_enabled
    )
    // resp is of type `HttpResponse<Recipe>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        this.settings.last_modified = Date.now().toString();
      });
  }
}
