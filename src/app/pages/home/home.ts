import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Search } from '../../components/search/search';
import {  HostListener } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Search],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {

  showProfileMenu = false;

  currentUser = {
<<<<<<< HEAD
    fullName: 'Người dùng',
    email: 'Chưa có email'
=======
    name: 'Khách truy cập',
    email: ''
>>>>>>> thach
  };

  uploadedDocuments: any[] = [];
  selectedUpload: any = null;
  deletedDocuments: any[] = [];
  favoriteSearchFiles: any[] = [];
  activityLog: any[] = [];
  activityLogVisible = false;

  private routerSubscription: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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

    // Load uploads on init
    const savedUploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    this.uploadedDocuments = Array.isArray(savedUploads) ? savedUploads : [];
    const savedTrash = JSON.parse(localStorage.getItem('trash') || '[]');
    this.deletedDocuments = Array.isArray(savedTrash) ? savedTrash : [];
    const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    this.activityLog = Array.isArray(savedActivityLog) ? savedActivityLog : [];
    this.loadFavoriteSearchFiles();
    console.log('Home loaded uploads count =', this.uploadedDocuments.length, this.uploadedDocuments);
    // ensure view updates
    try { this.cdr.detectChanges(); } catch (e) { /* noop */ }

    // Refresh uploadedDocuments after navigation (e.g., returning from upload page)
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const saved = JSON.parse(localStorage.getItem('uploads') || '[]');
        this.uploadedDocuments = Array.isArray(saved) ? saved : [];
        const savedT = JSON.parse(localStorage.getItem('trash') || '[]');
        this.deletedDocuments = Array.isArray(savedT) ? savedT : [];
        const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
        this.activityLog = Array.isArray(savedActivityLog) ? savedActivityLog : [];
        this.loadFavoriteSearchFiles();
        console.log('Home after navigation, uploads count =', this.uploadedDocuments.length);
        try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription && typeof this.routerSubscription.unsubscribe === 'function') {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleProfileMenu() {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.showProfileMenu = !this.showProfileMenu;
  }

  isLoggedIn() {
    return !!this.currentUser?.email && this.currentUser.email !== 'Chưa đăng nhập' && this.currentUser.email !== '';
  }

  // Profile edit state
  editingName = false;
  editName = '';

  startEditName() {
    this.editingName = true;
    this.editName = this.currentUser?.name || '';
  }

  saveName() {
    if (!this.editName || this.editName.trim().length === 0) {
      alert('Tên không được để trống');
      return;
    }

    this.currentUser = { ...this.currentUser, name: this.editName.trim() };
    try { localStorage.setItem('currentUser', JSON.stringify(this.currentUser)); } catch (e) { /* noop */ }
    this.addActivityLog(`Đã đổi tên người dùng thành "${this.editName.trim()}"`);
    this.editingName = false;
    try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
  }

  cancelEdit() {
    this.editingName = false;
    this.editName = '';
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

  goLogin() {
    this.showProfileMenu = false;
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = {
<<<<<<< HEAD
      fullName: 'Khách truy cập',
      email: 'Chưa đăng nhập'
=======
      name: 'Khách truy cập',
      email: ''
>>>>>>> thach
    };
    this.currentSection = 'home';
    this.showProfileMenu = false;
    this.router.navigate(['/login']);
  }

  currentSection = 'home';
  openSection(section: string) {
    this.currentSection = section;
    if (section === 'starred') {
      this.loadFavoriteSearchFiles();
    }
    this.showStorageMenu = false;
  }

  toggleActivityLog() {
    this.showProfileMenu = false;
    this.loadActivityLog();
    this.activityLogVisible = !this.activityLogVisible;
  }

  closeActivityLog() {
    this.activityLogVisible = false;
  }

  clearActivityLog() {
    if (!this.activityLog || this.activityLog.length === 0) {
      return;
    }

    if (!confirm('Bạn có chắc muốn xóa toàn bộ nhật ký hoạt động không?')) {
      return;
    }

    this.activityLog = [];
    localStorage.setItem('activityLog', JSON.stringify([]));
    alert('Nhật ký hoạt động đã được xóa.');
  }

  loadActivityLog() {
    const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    this.activityLog = Array.isArray(savedActivityLog) ? savedActivityLog : [];
  }

  loadFavoriteSearchFiles() {
    const saved = JSON.parse(localStorage.getItem('favoriteSearchFiles') || '[]');
    this.favoriteSearchFiles = Array.isArray(saved) ? saved : [];
  }

  removeFavoriteSearchItem(file: any) {
    if (!confirm('Bạn có chắc muốn gỡ tài liệu này khỏi Yêu thích không?')) {
      return;
    }

    const saved = JSON.parse(localStorage.getItem('favoriteSearchFiles') || '[]');
    const favorites = Array.isArray(saved) ? saved : [];
    const filtered = favorites.filter((item: any) => item.name !== file.name);
    localStorage.setItem('favoriteSearchFiles', JSON.stringify(filtered));
    this.favoriteSearchFiles = filtered;
  }

  get favoriteDocuments() {
    return [...this.uploadedDocuments.filter(item => item.favorite), ...this.favoriteSearchFiles];
  }

  toggleFavorite(upload: any) {
    if (upload && upload.uploadedAt) {
      const saved = JSON.parse(localStorage.getItem('uploads') || '[]');
      const uploads = Array.isArray(saved) ? saved : [];
      const idx = uploads.findIndex((u: any) => u.uploadedAt === upload.uploadedAt);
      if (idx === -1) return;

      uploads[idx] = {
        ...uploads[idx],
        favorite: !uploads[idx].favorite
      };

      localStorage.setItem('uploads', JSON.stringify(uploads));
      this.uploadedDocuments = uploads;
      if (!uploads[idx].favorite && this.currentSection === 'starred') {
        this.selectedUpload = null;
      }
      return;
    }

    if (upload && upload.name) {
      const saved = JSON.parse(localStorage.getItem('favoriteSearchFiles') || '[]');
      const favorites = Array.isArray(saved) ? saved : [];
      const filtered = favorites.filter((item: any) => item.name !== upload.name);
      localStorage.setItem('favoriteSearchFiles', JSON.stringify(filtered));
      this.favoriteSearchFiles = filtered;
    }
  }

  addActivityLog(message: string) {
    const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    const activityList = Array.isArray(savedActivityLog) ? savedActivityLog : [];
    const entry = {
      message,
      timestamp: new Date().toISOString()
    };

    activityList.unshift(entry);
    localStorage.setItem('activityLog', JSON.stringify(activityList));
    this.activityLog = activityList;
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

<<<<<<< HEAD
  const target = event.target as HTMLElement;

  if (!target.closest('.profile-dropdown')) {
    this.showProfileMenu = false;
  }

  if (!target.closest('.dropdown')) {
    this.showStorageMenu = false;
  }
}
=======
  deleteUpload(uploadedAt: string) {
    if (!confirm('Bạn có chắc muốn chuyển tệp này vào Thùng rác không?')) return;

    const saved = JSON.parse(localStorage.getItem('uploads') || '[]');
    const uploads = Array.isArray(saved) ? saved : [];
    const idx = uploads.findIndex((u: any) => u.uploadedAt === uploadedAt);
    if (idx === -1) return;

    const [item] = uploads.splice(idx, 1);
    item.favorite = false;
    item.deletedAt = new Date().toISOString();

    localStorage.setItem('uploads', JSON.stringify(uploads));
    this.uploadedDocuments = uploads;
    this.addActivityLog(`Đã xóa tài liệu "${item.title}" vào thùng rác`);

    const savedTrash = JSON.parse(localStorage.getItem('trash') || '[]');
    const trash = Array.isArray(savedTrash) ? savedTrash : [];
    trash.unshift(item);
    localStorage.setItem('trash', JSON.stringify(trash));
    this.deletedDocuments = trash;

    if (this.selectedUpload?.uploadedAt === uploadedAt) this.selectedUpload = null;
    try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
  }

  restoreUpload(uploadedAt: string) {
    if (!confirm('Khôi phục tệp này về Tài liệu của tôi?')) return;
    const savedTrash = JSON.parse(localStorage.getItem('trash') || '[]');
    const trash = Array.isArray(savedTrash) ? savedTrash : [];
    const idx = trash.findIndex((u: any) => u.uploadedAt === uploadedAt);
    if (idx === -1) return;
    const [item] = trash.splice(idx, 1);
    delete item.deletedAt;

    const savedUploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    const uploads = Array.isArray(savedUploads) ? savedUploads : [];
    uploads.unshift(item);

    localStorage.setItem('uploads', JSON.stringify(uploads));
    localStorage.setItem('trash', JSON.stringify(trash));
    this.uploadedDocuments = uploads;
    this.deletedDocuments = trash;
    this.addActivityLog(`Đã khôi phục tài liệu "${item.title}" từ thùng rác`);
    try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
  }

  permanentlyDelete(uploadedAt: string) {
    if (!confirm('Xóa vĩnh viễn tệp này khỏi thùng rác? Hành động không thể hoàn tác.')) return;
    const savedTrash = JSON.parse(localStorage.getItem('trash') || '[]');
    const trash = Array.isArray(savedTrash) ? savedTrash : [];
    const idx = trash.findIndex((u: any) => u.uploadedAt === uploadedAt);
    if (idx === -1) return;
    const [item] = trash.splice(idx, 1);
    const filtered = trash;
    localStorage.setItem('trash', JSON.stringify(filtered));
    this.deletedDocuments = filtered;
    this.addActivityLog(`Đã xóa vĩnh viễn tài liệu "${item.title}"`);
    if (this.selectedUpload?.uploadedAt === uploadedAt) this.selectedUpload = null;
    try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
  }

  viewDetails(upload: any) {
    this.selectedUpload = upload;
  }

  closeDetails() {
    this.selectedUpload = null;
  }

  async downloadFolder(upload: any) {
    if (!upload || !upload.filesData || !upload.filesData.length) {
      alert('Không có tệp nào để tải xuống trong thư mục này.');
      return;
    }

    const JSZip = (window as any).JSZip;
    if (!JSZip) {
      alert('JSZip chưa được nạp. Vui lòng đảm bảo script JSZip có trong trang.');
      return;
    }

    try {
      const zip = new JSZip();
      for (const f of upload.filesData) {
        // f.dataUrl is like: data:<mime>;base64,<base64data>
        const parts = (f.dataUrl || '').split(',');
        const base64 = parts[1] || '';
        zip.file(f.name, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (upload.folderName || upload.title || 'download') + '.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Lỗi khi tạo zip: ' + String(e));
    }
  }

>>>>>>> thach
}