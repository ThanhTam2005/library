import { Component, Input, Injectable } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentApiService, DocumentItem } from '../../services/document-api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {

  keyword = '';

  documents: any[] = [];

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
        favorite: true
      });

      this.saveSearchFavoriteFiles(favorites);
    }
  }

  private removeFromSearchFavorites(file: any) {
    const favorites = this.loadSearchFavoriteFiles();
    const filtered = favorites.filter((item: any) => item.name !== file.name);

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

  get searchResults() {
    const key = this.keyword.toLowerCase().trim();

    if (!key) {
      return [];
    }

    return this.documents.filter(item =>
      (item.name || '').toLowerCase().includes(key) ||
      (item.type || '').toLowerCase().includes(key) ||
      (item.description || '').toLowerCase().includes(key) ||
      (item.creator || '').toLowerCase().includes(key)
    );
  }

  getIcon(type: string) {
    const lowerType = (type || '').toLowerCase();

    if (lowerType.includes('pdf')) return '📕';
    if (lowerType.includes('doc') || lowerType.includes('word')) return '📄';

    return '📁';
  }
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
})
export class Search {

  @Input() mode: 'top' | 'main' = 'main';

  constructor(
    public searchState: SearchStateService,
    private documentApi: DocumentApiService
  ) { }

  ngOnInit() {
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

  clearSearch() {
    this.searchState.keyword = '';
  }

  toggleFavorite(file: any) {
    this.searchState.toggleFavorite(file);
  }

  readItem(item: any) {
    alert('Mở: ' + item.name);
  }
}