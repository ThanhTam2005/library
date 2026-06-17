import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Search } from '../../components/search/search';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Search],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {

  showProfileMenu = false;
  showStorageMenu = false;

  currentUser = {
    fullName: 'Khách truy cập',
    email: ''
  };

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  constructor(private router: Router) { }

  isLoggedIn() {
    return !!this.currentUser?.email && this.currentUser.email !== '';
  }

  toggleProfileMenu() {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.showProfileMenu = !this.showProfileMenu;
  }

  toggleStorageMenu() {
    this.showStorageMenu = !this.showStorageMenu;
  }

  goLogin() {
    this.showProfileMenu = false;
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('currentUser');

    this.currentUser = {
      fullName: 'Khách truy cập',
      email: ''
    };

    this.showProfileMenu = false;
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/home']);
    this.showStorageMenu = false;
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

    this.showStorageMenu = false;
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