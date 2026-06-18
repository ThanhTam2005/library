import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Search } from '../../components/search/search';
import * as mammoth from 'mammoth';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Search],
  templateUrl: './upload.html',
  styleUrls: ['./upload.css'],
})
export class Upload implements OnInit {

  constructor(private router: Router) { }

  showStorageMenu = false;
  showProfileMenu = false;

  currentUser = {
    fullName: 'Khách truy cập',
    email: ''
  };

  uploadData = {
    title: '',
    description: ''
  };

  selectedFiles: File[] = [];
  filePreview = '';
  uploadMessage = '';
  selectedFolder = false;
  selectedFilePreview: any = null;

  private readonly maxInlineSize = 5 * 1024 * 1024; // 5MB để lưu localStorage
  private readonly allowedExtensions = ['pdf', 'doc', 'docx'];

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

  toggleStorageMenu() {
    this.showStorageMenu = !this.showStorageMenu;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private addActivityLog(message: string) {
    const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    const activityList = Array.isArray(savedActivityLog) ? savedActivityLog : [];

    activityList.unshift({
      message,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('activityLog', JSON.stringify(activityList));
  }

  private getFileExtension(file: File): string {
    return file.name.split('.').pop()?.toLowerCase() || '';
  }

  private isAllowedFile(file: File): boolean {
    const ext = this.getFileExtension(file);
    return this.allowedExtensions.includes(ext);
  }

  private validateFiles(files: File[]): boolean {
    const invalidFile = files.find(file => !this.isAllowedFile(file));

    if (invalidFile) {
      alert(`File "${invalidFile.name}" không hợp lệ. Hệ thống chỉ nhận PDF, DOC, DOCX.`);
      return false;
    }

    const tooLargeFile = files.find(file => file.size > this.maxInlineSize);

    if (tooLargeFile) {
      alert(`File "${tooLargeFile.name}" quá lớn. Vui lòng chọn file dưới 5MB để có thể đọc trên web.`);
      return false;
    }

    return true;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (files.length === 0) {
      this.resetSelectedFiles();
      return;
    }

    if (!this.validateFiles(files)) {
      input.value = '';
      this.resetSelectedFiles();
      return;
    }

    this.selectedFolder = false;
    this.selectedFiles = files;
    this.selectedFilePreview = null;

    if (files.length === 1) {
      const file = files[0];
      this.filePreview = `${file.name} (${Math.round(file.size / 1024)} KB)`;
      this.selectedFilePreview = await this.prepareFilePreview(file);
    } else {
      this.filePreview = `${files.length} tệp đã chọn`;
    }
  }

  chooseFolder() {
    const folderInput = document.getElementById('folder') as HTMLInputElement | null;

    if (folderInput) {
      folderInput.click();
    }
  }

  async onFolderSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (files.length === 0) {
      this.resetSelectedFiles();
      return;
    }

    if (!this.validateFiles(files)) {
      input.value = '';
      this.resetSelectedFiles();
      return;
    }

    this.selectedFolder = true;
    this.selectedFiles = files;
    this.selectedFilePreview = null;

    const firstFile = files[0] as any;

    const folderName = firstFile.webkitRelativePath
      ? firstFile.webkitRelativePath.split('/')[0]
      : '';

    this.filePreview = folderName
      ? `Thư mục: ${folderName} (${files.length} tệp PDF/DOC/DOCX)`
      : `${files.length} tệp đã chọn`;
  }

  async upload() {
    if (this.uploadData.title.trim() === '') {
      alert('Vui lòng nhập tên tài liệu!');
      return;
    }

    if (this.uploadData.description.trim() === '') {
      alert('Vui lòng nhập mô tả tài liệu!');
      return;
    }

    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      alert('Vui lòng chọn tệp hoặc thư mục để tải lên!');
      return;
    }

    if (!this.validateFiles(this.selectedFiles)) {
      return;
    }

    const savedUploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    const uploads = Array.isArray(savedUploads) ? savedUploads : [];

    const isFolder =
      this.selectedFolder ||
      (this.selectedFiles.length > 1 && (this.selectedFiles[0] as any).webkitRelativePath);

    const uploadItem: any = {
      title: this.uploadData.title.trim(),
      description: this.uploadData.description.trim(),
      fileCount: this.selectedFiles.length,
      fileNames: this.selectedFiles.slice(0, 10).map(file => file.name),
      uploadedAt: new Date().toISOString(),
      isFolder,
      favorite: false
    };

    if (!isFolder && this.selectedFiles.length === 1) {
      const file = this.selectedFiles[0];
      const preview = await this.prepareFilePreview(file);

      uploadItem.fileName = file.name;
      uploadItem.fileType = preview.fileType;
      uploadItem.fileSizeKB = preview.fileSizeKB;
      uploadItem.fileExtension = preview.fileExtension;
      uploadItem.previewType = preview.previewType;

      if (preview.fileDataUrl) {
        uploadItem.fileDataUrl = preview.fileDataUrl;
      }

      if (preview.previewText) {
        uploadItem.previewText = preview.previewText;
      }
    }

    if (isFolder) {
      const first = this.selectedFiles[0] as any;

      if (first && first.webkitRelativePath) {
        uploadItem.folderName = first.webkitRelativePath.split('/')[0];
      }

      const filesData: Array<{
        name: string;
        dataUrl: string;
        extension: string;
        type: string;
      }> = [];

      for (const file of this.selectedFiles) {
        const dataUrl = await this.readFileAsDataURL(file);

        filesData.push({
          name: file.name,
          dataUrl,
          extension: this.getFileExtension(file),
          type: file.type || 'unknown'
        });
      }

      uploadItem.filesData = filesData;
    }

    uploads.push(uploadItem);
    localStorage.setItem('uploads', JSON.stringify(uploads));

    this.addActivityLog(`Tải lên tài liệu "${this.uploadData.title}" thành công`);

    this.uploadMessage = 'Tải lên thành công!';
    this.uploadData = { title: '', description: '' };
    this.resetSelectedFiles();

    alert('Tải lên thành công!');

    this.router.navigate(['/my-files'], {
      queryParams: { section: 'my-files' }
    });
  }

  private async prepareFilePreview(file: File) {
    const fileType = file.type || 'unknown';
    const fileName = file.name;
    const fileSizeKB = Math.round(file.size / 1024);
    const fileExtension = this.getFileExtension(file);

    const fileDataUrl = await this.readFileAsDataURL(file);

    let previewText = '';
    let previewType = '';

    if (fileExtension === 'pdf') {
      previewType = 'pdf';
    }

    else if (fileExtension === 'docx') {
      previewType = 'word';

      try {
        const arrayBuffer = await file.arrayBuffer();

        const result = await mammoth.extractRawText({
          arrayBuffer
        });

        previewText = result.value || '';
      } catch {
        previewText = '';
      }
    }

    else if (fileExtension === 'doc') {
      previewType = 'word-download-only';
      previewText = 'File DOC cũ không hỗ trợ đọc trực tiếp tốt trên trình duyệt. Bạn có thể tải xuống và mở bằng Microsoft Word.';
    }

    return {
      fileType,
      fileName,
      fileSizeKB,
      fileExtension,
      previewType,
      fileDataUrl,
      previewText: previewText ? previewText.slice(0, 12000) : undefined
    };
  }

  private resetSelectedFiles() {
    this.selectedFiles = [];
    this.filePreview = '';
    this.selectedFolder = false;
    this.selectedFilePreview = null;
  }

  private readFileAsDataURL(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();

      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => resolve('');

      reader.readAsDataURL(file);
    });
  }
}