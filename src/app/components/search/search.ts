import { Component, Input, Injectable } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {

  keyword = '';

  documents = [
    {
      name: 'Báo cáo thực tập.docx',
      type: 'Word',
      category: 'file',
      creator: 'Người dùng',
      description: 'Tài liệu báo cáo thực tập và tổng kết quá trình thực hiện dự án.',
      icon: '📄'
    },
    {
      name: 'Khóa luận tốt nghiệp.pdf',
      type: 'PDF',
      category: 'file',
      creator: 'Người dùng',
      description: 'Tài liệu tham khảo về cấu trúc và cách trình bày khóa luận.',
      icon: '📕'
    },
    {
      name: 'Mẫu kế hoạch dự án.xlsx',
      type: 'Excel',
      category: 'file',
      creator: 'Admin',
      description: 'Biểu mẫu lập kế hoạch, phân công và theo dõi tiến độ dự án.',
      icon: '📊'
    },
    {
      name: 'Slide thuyết trình.pptx',
      type: 'PowerPoint',
      category: 'file',
      creator: 'Admin',
      description: 'Mẫu slide trình bày báo cáo, đồ án hoặc khóa luận.',
      icon: '📽'
    },
    {
      name: 'Tài liệu học tập',
      type: 'Folder',
      category: 'folder',
      creator: 'Admin',
      description: 'Thư mục chứa các tài liệu học tập, bài giảng và biểu mẫu.',
      icon: '📁'
    },
    {
      name: 'Dự án tốt nghiệp',
      type: 'Folder',
      category: 'folder',
      creator: 'Người dùng',
      description: 'Thư mục lưu báo cáo, slide và tài liệu tham khảo cho dự án.',
      icon: '📁'
    }
  ];

  popularFiles = [
    {
      name: 'Báo cáo thực tập.docx',
      type: 'Word',
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
      name: 'Mẫu kế hoạch dự án.xlsx',
      type: 'Excel',
      searches: 74,
      description: 'Biểu mẫu lập kế hoạch, phân công công việc và theo dõi tiến độ dự án.',
      icon: '📊',
      favorite: false
    },
    {
      name: 'Slide thuyết trình.pptx',
      type: 'PowerPoint',
      searches: 63,
      description: 'Mẫu slide trình bày báo cáo, đồ án hoặc khóa luận.',
      icon: '📽',
      favorite: false
    },
    {
      name: 'Tài liệu yêu cầu hệ thống.docx',
      type: 'Word',
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

  private loadPopularFavorites() {
    const saved = JSON.parse(localStorage.getItem(this.favoriteStorageKey) || '[]');
    const favorites = Array.isArray(saved) ? saved : [];
    this.popularFavorites = new Set(favorites);
    for (const file of this.popularFiles) {
      file.favorite = this.popularFavorites.has(file.name);
    }
  }

  private savePopularFavorites() {
    localStorage.setItem(this.favoriteStorageKey, JSON.stringify(Array.from(this.popularFavorites)));
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
      favorites.unshift({ ...file, favorite: true });
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
      item.name.toLowerCase().includes(key) ||
      item.type.toLowerCase().includes(key) ||
      item.creator.toLowerCase().includes(key) ||
      item.description.toLowerCase().includes(key)
    );
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

  constructor(public searchState: SearchStateService) { }

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