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
      name: 'Báo cáo thực tập.docx',
      type: 'Word',
      searches: 128,
      description: 'Tài liệu mẫu về báo cáo thực tập và tổng kết quá trình thực hiện dự án.',
      icon: '📄'
    },
    {
      name: 'Khóa luận tốt nghiệp.pdf',
      type: 'PDF',
      searches: 96,
      description: 'Tài liệu tham khảo về cấu trúc, nội dung và cách trình bày khóa luận.',
      icon: '📕'
    },
    {
      name: 'Mẫu kế hoạch dự án.xlsx',
      type: 'Excel',
      searches: 74,
      description: 'Biểu mẫu lập kế hoạch, phân công công việc và theo dõi tiến độ dự án.',
      icon: '📊'
    }
  ];

  setDocuments(data: DocumentItem[]) {
    this.documents = data.map(item => ({
      ...item,
      category: 'file',
      creator: 'Admin',
      icon: this.getIcon(item.type)
    }));
  }

  get searchResults() {
    const key = this.keyword.toLowerCase().trim();

    if (!key) {
      return [];
    }

    return this.documents.filter(item =>
      item.name.toLowerCase().includes(key) ||
      item.type.toLowerCase().includes(key) ||
      item.description.toLowerCase().includes(key) ||
      item.creator.toLowerCase().includes(key)
    );
  }

  getIcon(type: string) {
    const lowerType = type.toLowerCase();

    if (lowerType.includes('pdf')) return '📕';
    if (lowerType.includes('word')) return '📄';
    if (lowerType.includes('excel')) return '📊';
    if (lowerType.includes('powerpoint')) return '📽';

    return '📁';
  }
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
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

  readItem(item: any) {
    alert('Mở: ' + item.name);
  }
}