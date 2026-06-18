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

  constructor(private router: Router) { }

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch {
        this.currentUser = {
          fullName: 'Khách truy cập',
          email: ''
        };
      }
    }
  }

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

  goHome() {
    this.router.navigate(['/home']);
    this.showStorageMenu = false;
    this.showProfileMenu = false;
  }

  goLogin() {
    this.showProfileMenu = false;
    this.showStorageMenu = false;
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('currentUser');

    this.currentUser = {
      fullName: 'Khách truy cập',
      email: ''
    };

    this.showProfileMenu = false;
    this.showStorageMenu = false;

    this.router.navigate(['/login']);
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
    this.showProfileMenu = false;
  }

  goToMyFilesSection(section: string) {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      this.router.navigate(['/my-files'], {
        queryParams: { section }
      });
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          redirect: 'my-files',
          section: section
        }
      });
    }

    this.showStorageMenu = false;
    this.showProfileMenu = false;
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