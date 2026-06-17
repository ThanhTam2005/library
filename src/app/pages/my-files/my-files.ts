import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { renderAsync } from 'docx-preview';
@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-files.html',
  styleUrl: './my-files.css'
})
export class MyFiles implements OnInit {
  uploadedDocuments: any[] = [];
  deletedDocuments: any[] = [];
  activityLog: any[] = [];
  selectedUpload: any = null;
  ngOnInit(): void {
    this.uploadedDocuments =
      JSON.parse(localStorage.getItem('uploads') || '[]');
    this.deletedDocuments =
      JSON.parse(localStorage.getItem('trash') || '[]');
    this.activityLog =
      JSON.parse(localStorage.getItem('activityLog') || '[]');
  }
  get favoriteDocuments() {
    return this.uploadedDocuments.filter(file => file.favorite);
  }
  toggleFavorite(file: any) {
    file.favorite = !file.favorite;
    localStorage.setItem(
      'uploads',
      JSON.stringify(this.uploadedDocuments)
    );
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
      timestamp: new Date()
    });
    localStorage.setItem(
      'activityLog',
      JSON.stringify(this.activityLog)
    );
  }
  deleteUpload(uploadedAt: string) {
    const index =
      this.uploadedDocuments.findIndex(
        file => file.uploadedAt === uploadedAt
      );
    if (index === -1) return;
    const file =
      this.uploadedDocuments.splice(index, 1)[0];
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
  }
  restoreUpload(uploadedAt: string) {
    const index =
      this.deletedDocuments.findIndex(
        file => file.uploadedAt === uploadedAt
      );
    if (index === -1) return;
    const file =
      this.deletedDocuments.splice(index, 1)[0];
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
  }
  permanentlyDelete(uploadedAt: string) {
    this.deletedDocuments =
      this.deletedDocuments.filter(
        file => file.uploadedAt !== uploadedAt
      );
    localStorage.setItem(
      'trash',
      JSON.stringify(this.deletedDocuments)
    );
  }
  downloadFolder(folder: any) {
    alert(
      `Tải xuống thư mục: ${folder.title}`
    );

  }
}