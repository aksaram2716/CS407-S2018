import * as $ from 'jquery';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit } from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';

import { FormControl, NgModel } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';


import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {Router} from '@angular/router';
import {JustRecipesAPIService} from '../../services/api.service';

// export class State {
//   constructor(public name: string, public population: string, public flag: string) { }
// }

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: [],
})

export class FullComponent implements OnDestroy, AfterViewInit {
  headers: string[];
  searchControl: FormControl;
  searchQueries: string[] = [];
  filteredQueries: Observable<string[]> = Observable[''];
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  green = true;
  blue = false;
  dark = false;
  minisidebar: boolean;
  boxed: boolean;
  danger: boolean;
  showHide:boolean;
  sidebarOpened = false;
  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;
  isHomePage = true;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: Router,
    private _justRecipesAPIService: JustRecipesAPIService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.searchControl = new FormControl();
    // this.filteredQueries = this.searchControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(val => this.filter(val))
    //   );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
 ngAfterViewInit() {
     // This is for the topbar search
     (<any>$('.srh-btn, .cl-srh-btn')).on('click', function () {
       (<any>$('.app-search')).toggle(200);
     });

   this._justRecipesAPIService.getSearchHistoryResponse()
   // resp is of type `HttpResponse<Recipe>`
     .subscribe(resp => {
       // display its headers
       const keys = resp.headers.keys();
       this.headers = keys.map(key =>
         `${key}: ${resp.headers.get(key)}`);

       // access the body directly, which is typed as `Recipe`.
       // get object
       this.searchQueries = resp.body;
       // alert(JSON.stringify(this.recipe));
     });

   this.filteredQueries = this.searchControl.valueChanges
     .pipe(
       startWith(''),
       map(val => this.filter(val))
     );
 }

  filter(val: string): string[] {
    return this.searchQueries.filter(searchQuery =>
      searchQuery.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  searchRecipes(event: any) {
    this.router.navigate(['home'], {
      queryParams: {
        q: event.target.value
      }
    });
  }

  goHome() {
    this.router.navigate(['home'], {
      queryParams: {
        q: ''
      }
    });
  }
}
