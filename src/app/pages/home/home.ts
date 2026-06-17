import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Search } from '../../components/search/search';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Search],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {

  showProfileMenu = false;

  currentUser = {
    fullName: 'Khách truy cập',
    email: ''
  };

  editingName = false;
  editName = '';

  currentSection = 'home';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    const userData = localStorage.getItem('currentUser');

    if (userData) {
      this.currentUser = JSON.parse(userData);
    }

    const section = this.route.snapshot.queryParamMap.get('section');

    if (section) {
      this.currentSection = section;
    }

    try {
      this.cdr.detectChanges();
    } catch (e) {}
  }

  ngOnDestroy() {}

  toggleProfileMenu() {

    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.showProfileMenu = !this.showProfileMenu;
  }

  isLoggedIn() {
    return !!this.currentUser?.email;
  }

  startEditName() {
    this.editingName = true;
    this.editName = this.currentUser.fullName;
  }

  saveName() {

    if (!this.editName || this.editName.trim() === '') {
      alert('Tên không được để trống');
      return;
    }

    this.currentUser = {
      ...this.currentUser,
      fullName: this.editName.trim()
    };

    localStorage.setItem(
      'currentUser',
      JSON.stringify(this.currentUser)
    );

    this.editingName = false;

    try {
      this.cdr.detectChanges();
    } catch (e) {}
  }

  cancelEdit() {
    this.editingName = false;
    this.editName = '';
  }

  goToLoginForUpload() {

    this.router.navigate(['/login'], {
      queryParams: {
        redirect: 'upload'
      }
    });

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

    this.currentSection = 'home';
    this.showProfileMenu = false;

    this.router.navigate(['/login']);
  }

  openSection(section: string) {
    this.currentSection = section;
  }

  goToProtectedSection(section: string) {

    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      this.openSection(section);
    }
    else {

      this.router.navigate(['/login'], {
        queryParams: {
          redirect: section
        }
      });

    }
  }

  goToProtectedPage(page: string) {

    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {

      this.router.navigate(['/' + page]);

    }
    else {

      this.router.navigate(['/login'], {
        queryParams: {
          redirect: page
        }
      });

    }

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const target = event.target as HTMLElement;

    if (!target.closest('.profile-dropdown')) {
      this.showProfileMenu = false;
    }

  }

}