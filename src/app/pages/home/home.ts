import { Component } from '@angular/core';
// import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Search } from '../../components/search/search';
import {  HostListener } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, Search],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  showProfileMenu = false;

  currentUser = {
    fullName: 'Người dùng',
    email: 'Chưa có email'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      this.currentUser = JSON.parse(userData);
    }

    const section = this.route.snapshot.queryParamMap.get('section');

    if (section) {
      this.currentSection = section;
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }


  showStorageMenu = false;
  toggleStorageMenu() {
    this.showStorageMenu = !this.showStorageMenu;
  }

  goToLoginForUpload() {
    this.router.navigate(['/login'], {
      queryParams: { redirect: 'upload' }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = {
      fullName: 'Khách truy cập',
      email: 'Chưa đăng nhập'
    };
    this.currentSection = 'home';
    this.router.navigate(['/home']);
  }

  currentSection = 'home';
  openSection(section: string) {
    this.currentSection = section;
    this.showStorageMenu = false;
  }

  goToProtectedSection(section: string) {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      this.openSection(section);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirect: section }
      });
    }
  }

  goToProtectedPage(page: string) {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      this.router.navigate(['/' + page]);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirect: page }
      });
    }
  }
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {

  const target = event.target as HTMLElement;

  if (!target.closest('.profile-dropdown')) {
    this.showProfileMenu = false;
  }

  if (!target.closest('.dropdown')) {
    this.showStorageMenu = false;
  }
}
}