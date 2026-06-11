import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {

  currentTab = '';

  // USERS
  users: any[] = [];

  // DOCUMENTS
  documents: any[] = [];
  filteredDocuments: any[] = [];

  newDoc = {
    title: '',
    author: ''
  };

  selectedFile: File | null = null;

  editIndex = -1;

  // SEARCH
  searchText: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const savedDocs = localStorage.getItem('documents');

    if (savedDocs) {
      this.documents = JSON.parse(savedDocs);
      this.filteredDocuments = [...this.documents];
    }
  }

  // ================= USER =================

  showUsersTab() {
    this.currentTab = 'users';
    this.getUsersFromDatabase();
  }

  getUsersFromDatabase() {
    this.http.get<any[]>('http://localhost:3000/api/users')
      .subscribe({
        next: (data) => {
          this.users = data;
          console.log('Danh sách người dùng từ database:', data);
        },
        error: (error) => {
          console.error('Lỗi lấy danh sách người dùng:', error);
          alert('Không lấy được danh sách người dùng từ database!');
        }
      });
  }

  deleteUser(index: number) {
    if (!confirm('Bạn có chắc muốn xóa người dùng?')) return;

    const user = this.users[index];

    this.users.splice(index, 1);

    alert('Đã xóa người dùng khỏi giao diện!');
  }

  // ================= DOCUMENT =================

  showDocumentsTab() {
    this.currentTab = 'documents';
    this.filteredDocuments = [...this.documents];
  }

  saveData() {
    localStorage.setItem(
      'documents',
      JSON.stringify(this.documents)
    );
  }

  // 📂 chọn file
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // ➕ thêm tài liệu
  addDocument() {

    if (
      this.newDoc.title.trim() === '' ||
      this.newDoc.author.trim() === ''
    ) {
      alert('Nhập đầy đủ thông tin!');
      return;
    }

    this.documents.push({
      id: Date.now(),
      title: this.newDoc.title,
      author: this.newDoc.author,
      fileName: this.selectedFile ? this.selectedFile.name : null
    });

    this.saveData();
    this.filterDocuments();
    this.resetForm();

    alert('Thêm tài liệu thành công!');
  }

  // ✏️ sửa
  editDocument(index: number) {
    this.editIndex = index;

    const doc = this.filteredDocuments[index];

    this.newDoc = {
      title: doc.title,
      author: doc.author
    };

    this.selectedFile = null;
  }

  // 🔄 cập nhật
  updateDocument() {

    const doc = this.filteredDocuments[this.editIndex];

    doc.title = this.newDoc.title;
    doc.author = this.newDoc.author;

    if (this.selectedFile) {
      doc.fileName = this.selectedFile.name;
    }

    this.saveData();
    this.filterDocuments();

    this.editIndex = -1;
    this.resetForm();

    alert('Cập nhật thành công!');
  }

  // 🗑 xoá
  deleteDocument(index: number) {

    if (!confirm('Bạn có chắc muốn xóa tài liệu?')) return;

    const realIndex = this.documents.findIndex(
      d => d.id === this.filteredDocuments[index].id
    );

    this.documents.splice(realIndex, 1);

    this.saveData();
    this.filterDocuments();

    alert('Xóa thành công!');
  }

  // 🔄 reset form
  resetForm() {
    this.newDoc = {
      title: '',
      author: ''
    };

    this.selectedFile = null;
  }

  // 🔍 search
  filterDocuments() {

    const keyword = this.searchText.toLowerCase().trim();

    this.filteredDocuments = this.documents.filter(doc =>
      doc.id.toString().toLowerCase().includes(keyword) ||
      doc.title.toLowerCase().includes(keyword) ||
      doc.author.toLowerCase().includes(keyword)
    );
  }
}