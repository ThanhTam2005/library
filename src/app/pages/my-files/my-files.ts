import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-files.html',
  styleUrl: './my-files.css'
})
export class MyFiles implements OnInit {

  currentSection = 'my-files';

  uploadedDocuments: any[] = [];
  deletedDocuments: any[] = [];
  activityLog: any[] = [];

  // File được yêu thích từ phần tìm kiếm nổi bật
  favoriteSearchDocuments: any[] = [];

  selectedUpload: any = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.currentSection = params.get('section') || 'my-files';
      this.selectedUpload = null;
      this.loadData();
    });

    this.loadData();
  }

  loadData() {
    const uploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    const trash = JSON.parse(localStorage.getItem('trash') || '[]');
    const logs = JSON.parse(localStorage.getItem('activityLog') || '[]');

    const favoriteSearchFiles = JSON.parse(
      localStorage.getItem('favoriteSearchFiles') || '[]'
    );

    this.uploadedDocuments = Array.isArray(uploads) ? uploads : [];
    this.deletedDocuments = Array.isArray(trash) ? trash : [];
    this.activityLog = Array.isArray(logs) ? logs : [];

    this.favoriteSearchDocuments = Array.isArray(favoriteSearchFiles)
      ? favoriteSearchFiles.map(file => ({
        ...file,
        title: file.title || file.name || 'Tài liệu yêu thích',
        description: file.description || 'Tài liệu được đánh dấu yêu thích từ tìm kiếm.',
        fileName: file.fileName || file.name || '',
        fileType: file.fileType || file.type || 'Tệp nổi bật',
        fileExtension: file.fileExtension || '',
        favorite: true,
        fromSearch: true
      }))
      : [];
  }

  changeSection(section: string) {
    this.currentSection = section;
    this.selectedUpload = null;
    this.loadData();
  }

  get favoriteDocuments() {
    const uploadFavorites = this.uploadedDocuments.filter(file => file.favorite);

    return [
      ...uploadFavorites,
      ...this.favoriteSearchDocuments
    ];
  }

  get recentDocuments() {
    return [...this.uploadedDocuments].sort((a, b) => {
      return new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime();
    });
  }

  toggleFavorite(file: any) {
    // Nếu là file yêu thích từ phần tìm kiếm nổi bật
    if (file.fromSearch) {
      this.removeFavoriteSearchFile(file);
      this.loadData();
      return;
    }

    // Nếu là file upload bình thường
    const target = this.uploadedDocuments.find(
      item => item.uploadedAt === file.uploadedAt
    );

    if (target) {
      target.favorite = !target.favorite;

      localStorage.setItem(
        'uploads',
        JSON.stringify(this.uploadedDocuments)
      );

      if (target.favorite) {
        this.addActivityLog(`Đã đánh dấu yêu thích "${target.title}"`);
      } else {
        this.addActivityLog(`Đã gỡ yêu thích "${target.title}"`);
      }
    }

    this.loadData();
  }

  private removeFavoriteSearchFile(file: any) {
    const favoriteSearchFiles = JSON.parse(
      localStorage.getItem('favoriteSearchFiles') || '[]'
    );

    const favoriteList = Array.isArray(favoriteSearchFiles)
      ? favoriteSearchFiles
      : [];

    const fileName = file.name || file.title || file.fileName;

    const newFavoriteList = favoriteList.filter(item => {
      const itemName = item.name || item.title || item.fileName;
      return itemName !== fileName;
    });

    localStorage.setItem(
      'favoriteSearchFiles',
      JSON.stringify(newFavoriteList)
    );

    // Nếu search.ts có lưu thêm danh sách tên yêu thích thì xóa luôn
    const popularFavorites = JSON.parse(
      localStorage.getItem('popularFileFavorites') || '[]'
    );

    if (Array.isArray(popularFavorites)) {
      const newPopularFavorites = popularFavorites.filter(name => name !== fileName);

      localStorage.setItem(
        'popularFileFavorites',
        JSON.stringify(newPopularFavorites)
      );
    }

    this.addActivityLog(`Đã gỡ yêu thích "${fileName}"`);
  }

  viewDetails(file: any) {
    this.selectedUpload = file;
  }

  closeDetails() {
    this.selectedUpload = null;
  }

  clearActivityLog() {
    if (!confirm('Xóa toàn bộ nhật ký hoạt động?')) {
      return;
    }

    this.activityLog = [];

    localStorage.setItem(
      'activityLog',
      JSON.stringify([])
    );
  }

  addActivityLog(message: string) {
    this.activityLog.unshift({
      message,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(
      'activityLog',
      JSON.stringify(this.activityLog)
    );
  }

  deleteUpload(uploadedAt: string) {
    const index = this.uploadedDocuments.findIndex(
      file => file.uploadedAt === uploadedAt
    );

    if (index === -1) return;

    const file = this.uploadedDocuments.splice(index, 1)[0];

    file.favorite = false;
    file.deletedAt = new Date().toISOString();

    this.deletedDocuments.unshift(file);

    localStorage.setItem(
      'uploads',
      JSON.stringify(this.uploadedDocuments)
    );

    localStorage.setItem(
      'trash',
      JSON.stringify(this.deletedDocuments)
    );

    this.addActivityLog(`Đã xóa "${file.title}"`);
    this.loadData();
  }

  restoreUpload(uploadedAt: string) {
    const index = this.deletedDocuments.findIndex(
      file => file.uploadedAt === uploadedAt
    );

    if (index === -1) return;

    const file = this.deletedDocuments.splice(index, 1)[0];

    delete file.deletedAt;

    this.uploadedDocuments.unshift(file);

    localStorage.setItem(
      'uploads',
      JSON.stringify(this.uploadedDocuments)
    );

    localStorage.setItem(
      'trash',
      JSON.stringify(this.deletedDocuments)
    );

    this.addActivityLog(`Đã khôi phục "${file.title}"`);
    this.loadData();
  }

  permanentlyDelete(uploadedAt: string) {
    const file = this.deletedDocuments.find(
      item => item.uploadedAt === uploadedAt
    );

    this.deletedDocuments = this.deletedDocuments.filter(
      item => item.uploadedAt !== uploadedAt
    );

    localStorage.setItem(
      'trash',
      JSON.stringify(this.deletedDocuments)
    );

    if (file) {
      this.addActivityLog(`Đã xóa vĩnh viễn "${file.title}"`);
    }

    this.loadData();
  }

  downloadFolder(folder: any) {
    alert(`Tải xuống thư mục: ${folder.title}`);
  }

  isPdfFile(file: any): boolean {
    return file?.fileExtension === 'pdf' || file?.previewType === 'pdf';
  }

  isWordFile(file: any): boolean {
    return file?.fileExtension === 'docx' || file?.fileExtension === 'doc';
  }

  getSafeFileUrl(fileUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }
}