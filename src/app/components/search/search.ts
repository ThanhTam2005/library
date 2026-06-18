import { Component, Input, Injectable, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentApiService, DocumentItem } from '../../services/document-api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {

  keyword = '';

  documents: any[] = [];
  uploadedDocuments: any[] = [];

  popularFiles = [
    {
      name: 'Báo cáo thực tập.doc',
      type: 'DOC',
      searches: 128,
      description: 'Tài liệu mẫu về báo cáo thực tập và tổng kết quá trình thực hiện dự án.',
      icon: '📄',
      favorite: false
    },
    {
      name: 'Khóa luận tốt nghiệp.pdf',
      type: 'PDF',
      searches: 96,
      description: 'Tài liệu tham khảo về cấu trúc, nội dung và cách trình bày khóa luận.',
      icon: '📕',
      favorite: false
    },
    {
      name: 'Tài liệu yêu cầu hệ thống.doc',
      type: 'DOC',
      searches: 51,
      description: 'Tài liệu mô tả yêu cầu chức năng và phi chức năng của hệ thống.',
      icon: '📄',
      favorite: false
    },
    {
      name: 'Biểu mẫu đăng ký.pdf',
      type: 'PDF',
      searches: 39,
      description: 'Các biểu mẫu thường dùng trong quá trình học tập và làm việc.',
      icon: '📕',
      favorite: false
    }
  ];

  private favoriteStorageKey = 'popularFileFavorites';
  private favoriteSearchFilesKey = 'favoriteSearchFiles';
  private popularFavorites = new Set<string>();

  constructor() {
    this.loadPopularFavorites();
    this.loadUploadedDocuments();
  }

  setDocuments(data: DocumentItem[]) {
    this.documents = data.map(item => ({
      ...item,
      category: 'file',
      creator: item.owner_name || 'Admin',
      icon: this.getIcon(item.type),
      favorite: false
    }));
  }

  loadUploadedDocuments() {
    const savedUploads = JSON.parse(localStorage.getItem('uploads') || '[]');

    this.uploadedDocuments = Array.isArray(savedUploads)
      ? [...savedUploads].reverse()
      : [];
  }

  private loadPopularFavorites() {
    const saved = JSON.parse(localStorage.getItem(this.favoriteStorageKey) || '[]');
    const favorites = Array.isArray(saved) ? saved : [];

    this.popularFavorites = new Set(favorites);

    for (const file of this.popularFiles) {
      file.favorite = this.popularFavorites.has(file.name);
    }
  }

  private savePopularFavorites() {
    localStorage.setItem(
      this.favoriteStorageKey,
      JSON.stringify(Array.from(this.popularFavorites))
    );
  }

  private loadSearchFavoriteFiles(): any[] {
    const saved = JSON.parse(localStorage.getItem(this.favoriteSearchFilesKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  }

  private saveSearchFavoriteFiles(files: any[]) {
    localStorage.setItem(this.favoriteSearchFilesKey, JSON.stringify(files));
  }

  private addToSearchFavorites(file: any) {
    const favorites = this.loadSearchFavoriteFiles();

    if (!favorites.find((item: any) => item.name === file.name)) {
      favorites.unshift({
        ...file,
        title: file.name,
        fileName: file.name,
        fileType: file.type,
        fileExtension: (file.type || '').toLowerCase(),
        favorite: true,
        fromSearch: true
      });

      this.saveSearchFavoriteFiles(favorites);
    }
  }

  private removeFromSearchFavorites(file: any) {
    const favorites = this.loadSearchFavoriteFiles();

    const filtered = favorites.filter((item: any) => {
      const itemName = item.name || item.title || item.fileName;
      return itemName !== file.name;
    });

    this.saveSearchFavoriteFiles(filtered);
  }

  toggleFavorite(file: any) {
    const nextValue = !file.favorite;

    file.favorite = nextValue;

    if (nextValue) {
      this.popularFavorites.add(file.name);
      this.addToSearchFavorites(file);
    } else {
      this.popularFavorites.delete(file.name);
      this.removeFromSearchFavorites(file);
    }

    this.savePopularFavorites();
  }

  toggleUploadedFavorite(file: any) {
    const savedUploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    const uploads = Array.isArray(savedUploads) ? savedUploads : [];

    const target = uploads.find((item: any) => item.uploadedAt === file.uploadedAt);

    if (!target) return;

    target.favorite = !target.favorite;
    file.favorite = target.favorite;

    localStorage.setItem('uploads', JSON.stringify(uploads));
    this.loadUploadedDocuments();
  }

  get searchResults() {
    const key = this.keyword.toLowerCase().trim();

    if (!key) return [];

    const apiResults = this.documents.filter(item =>
      (item.name || '').toLowerCase().includes(key) ||
      (item.type || '').toLowerCase().includes(key) ||
      (item.description || '').toLowerCase().includes(key) ||
      (item.creator || '').toLowerCase().includes(key)
    );

    const uploadedResults = this.uploadedDocuments.filter(item =>
      (item.title || '').toLowerCase().includes(key) ||
      (item.fileName || '').toLowerCase().includes(key) ||
      (item.fileExtension || '').toLowerCase().includes(key) ||
      (item.description || '').toLowerCase().includes(key)
    );

    return [
      ...uploadedResults,
      ...apiResults
    ];
  }

  getIcon(type: string) {
    const lowerType = (type || '').toLowerCase();

    if (lowerType.includes('pdf')) return '📕';
    if (lowerType.includes('doc') || lowerType.includes('word')) return '📄';

    return '📁';
  }

  getUploadedIcon(file: any) {
    if (file?.isFolder) return '📁';

    const ext = (file?.fileExtension || '').toLowerCase();

    if (ext === 'pdf') return '📕';
    if (ext === 'doc' || ext === 'docx') return '📄';

    return '📄';
  }
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class Search implements OnInit {

  @Input() mode: 'top' | 'main' = 'main';

  selectedUpload: any = null;

  constructor(
    public searchState: SearchStateService,
    private documentApi: DocumentApiService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.searchState.loadUploadedDocuments();

    this.documentApi.getDocuments().subscribe({
      next: (data) => {
        this.searchState.setDocuments(data);
        console.log('Dữ liệu lấy từ API:', data);
      },
      error: (error) => {
        console.error('Lỗi gọi API documents:', error);
      }
    });
  }

  get keyword() {
    return this.searchState.keyword;
  }

  set keyword(value: string) {
    this.searchState.keyword = value;
  }

  get searchResults() {
    return this.searchState.searchResults;
  }

  get popularFiles() {
    return this.searchState.popularFiles;
  }

  get uploadedDocuments() {
    return this.searchState.uploadedDocuments;
  }

  clearSearch() {
    this.searchState.keyword = '';
  }

  toggleFavorite(file: any) {
    this.searchState.toggleFavorite(file);
  }

  toggleUploadedFavorite(file: any) {
    this.searchState.toggleUploadedFavorite(file);
  }

  getUploadedIcon(file: any) {
    return this.searchState.getUploadedIcon(file);
  }

  readItem(item: any) {
    if (item.uploadedAt) {
      this.selectedUpload = item;
      return;
    }

    alert('Đây là tài liệu mẫu, chưa có file thật để đọc: ' + item.name);
  }

  closeDetails() {
    this.selectedUpload = null;
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

  goToMyFiles() {
    this.router.navigate(['/my-files'], {
      queryParams: { section: 'my-files' }
    });
  }
}