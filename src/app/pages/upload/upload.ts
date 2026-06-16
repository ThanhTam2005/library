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
export class Upload implements OnInit  {
  constructor(private router: Router) {}
  showStorageMenu = false;
showProfileMenu = false;

currentUser = {
  name: 'Khách truy cập',
  email: ''
};

ngOnInit() {
  const userData = localStorage.getItem('currentUser');

  if (userData) {
    this.currentUser = JSON.parse(userData);
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
  uploadData = {
    title: '',
    description: ''
  };

  private addActivityLog(message: string) {
    const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    const activityList = Array.isArray(savedActivityLog) ? savedActivityLog : [];
    activityList.unshift({ message, timestamp: new Date().toISOString() });
    localStorage.setItem('activityLog', JSON.stringify(activityList));
  }

  selectedFiles: File[] = [];
  filePreview = '';
  uploadMessage = '';
  selectedFolder = false;
  selectedFilePreview: any = null;

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (files.length === 0) {
      this.selectedFiles = [];
      this.filePreview = '';
      this.selectedFolder = false;
      this.selectedFilePreview = null;
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

  onFolderSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (files.length === 0) {
      this.selectedFiles = [];
      this.filePreview = '';
      this.selectedFolder = false;
      this.selectedFilePreview = null;
      return;
    }

    this.selectedFolder = true;
    this.selectedFiles = files;
    this.selectedFilePreview = null;
    const folderName = (files[0] as any).webkitRelativePath
      ? (files[0] as any).webkitRelativePath.split('/')[0]
      : '';
    this.filePreview = folderName
      ? `Thư mục: ${folderName} (${files.length} tệp)`
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

    const savedUploads = JSON.parse(localStorage.getItem('uploads') || '[]');

    const isFolder = this.selectedFolder || (this.selectedFiles.length > 1 && (this.selectedFiles[0] as any).webkitRelativePath);

    const uploadItem: any = {
      title: this.uploadData.title,
      description: this.uploadData.description,
      fileCount: this.selectedFiles.length,
      fileNames: this.selectedFiles.slice(0, 6).map(f => f.name),
      uploadedAt: new Date().toISOString(),
      isFolder
    };

    if (!isFolder && this.selectedFiles.length === 1) {
      const f = this.selectedFiles[0];
      uploadItem.fileName = f.name;
      uploadItem.fileType = this.selectedFilePreview?.fileType || f.type || 'unknown';
      uploadItem.fileSizeKB = this.selectedFilePreview?.fileSizeKB || Math.round(f.size / 1024);
      uploadItem.fileExtension = this.selectedFilePreview?.fileExtension;
      if (this.selectedFilePreview?.fileDataUrl) {
        uploadItem.fileDataUrl = this.selectedFilePreview.fileDataUrl;
        
      }
      if (this.selectedFilePreview?.previewData) {
        uploadItem.previewData = this.selectedFilePreview.previewData;
      }
      if (this.selectedFilePreview?.previewText) {
        uploadItem.previewText = this.selectedFilePreview.previewText;
      }
      if (this.selectedFilePreview?.tooLarge) {
        uploadItem.tooLarge = true;
      }
    }

    if (isFolder) {
      const first = this.selectedFiles[0] as any;
      if (first && first.webkitRelativePath) {
        uploadItem.folderName = first.webkitRelativePath.split('/')[0];
      }

      // For folder uploads, attempt to store small files' data URLs so they can be downloaded later.
      const filesData: Array<{ name: string; dataUrl: string }> = [];
      const maxInlineSize = 2 * 1024 * 1024; // 2 MB per file
      for (const f of this.selectedFiles) {
        try {
          if (f.size <= maxInlineSize) {
            const dataUrl = await this.readFileAsDataURL(f);
            filesData.push({ name: f.name, dataUrl });
          }
        } catch (e) {
          // ignore read errors per-file
        }
      }

      if (filesData.length) {
        uploadItem.filesData = filesData;
      }
      // count files too large (not included)
      const tooLarge = this.selectedFiles.filter(f => f.size > maxInlineSize).length;
      if (tooLarge) uploadItem.filesTooLargeCount = tooLarge;
    }

    savedUploads.push(uploadItem);
    localStorage.setItem('uploads', JSON.stringify(savedUploads));
    this.addActivityLog(`Tải lên tài liệu "${this.uploadData.title}" thành công`);

    this.uploadMessage = 'Tải lên thành công! Tệp đã được lưu vào bộ nhớ cục bộ.';
    this.uploadData = { title: '', description: '' };
    this.selectedFiles = [];
    this.filePreview = '';
    this.selectedFolder = false;
    this.selectedFilePreview = null;

    // Debug: thông báo số phần tử đã lưu
    try {
      alert('Đã lưu ' + savedUploads.length + ' mục. Chuyển về trang chủ...');
    } catch (e) { }

    // Điều hướng về trang chủ để hiển thị mục vừa upload
    this.router.navigate(['/home']);
  }

private async prepareFilePreview(file: File) {

  const fileType = file.type || 'unknown';
  const fileName = file.name;
  const fileSizeKB = Math.round(file.size / 1024);
  const fileExtension =
    file.name.split('.').pop()?.toLowerCase() || '';

  const maxInlineSize = 2 * 1024 * 1024;

  const shouldStoreDataUrl = file.size <= maxInlineSize;

  const fileDataUrl = shouldStoreDataUrl
    ? await this.readFileAsDataURL(file)
    : '';

  let previewData = '';
  let previewText = '';

  // Ảnh
  if (fileType.startsWith('image/')) {

    previewData = fileDataUrl;

  }

  // txt, json, csv,...
  else if (
    fileType.startsWith('text/') ||
    ['txt', 'md', 'json', 'csv', 'xml', 'html']
      .includes(fileExtension)
  ) {

    previewText = await this.readFileAsText(file);

  }

  // Word .docx
  else if (fileExtension === 'docx') {

    try {

      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.extractRawText({
        arrayBuffer
      });

      previewText = result.value;

    }
    catch {

      previewText = '';

    }

  }

  return {

    fileType,
    fileName,
    fileSizeKB,
    fileExtension,

    fileDataUrl: fileDataUrl || undefined,

    previewData: previewData || undefined,

    previewText:
      previewText
        ? previewText.slice(0, 12000)
        : undefined,

    tooLarge: !shouldStoreDataUrl

  };

}

  private readFileAsDataURL(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  private readFileAsText(file: File) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string || '');
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  }
}
