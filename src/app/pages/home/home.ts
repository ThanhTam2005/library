import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  showProfileMenu = false;

  currentUser = {
    name: 'Người dùng',
    email: 'Chưa có email'
  };

  recentFiles = [
    {
      name: 'Báo cáo thực tập.docx',
      type: 'Word',
      date: 'Hôm nay',
      icon: '📄'
    },
    {
      name: 'Danh sách tài liệu.xlsx',
      type: 'Excel',
      date: 'Hôm qua',
      icon: '📊'
    },
    {
      name: 'Slide thuyết trình.pptx',
      type: 'PowerPoint',
      date: '2 ngày trước',
      icon: '📽'
    }
  ];

  favoriteFiles = [
    {
      name: 'Khóa luận tốt nghiệp.pdf',
      type: 'PDF',
      date: 'Đã đánh dấu',
      icon: '📕'
    },
    {
      name: 'Tài liệu yêu cầu hệ thống.docx',
      type: 'Word',
      date: 'Đã đánh dấu',
      icon: '📄'
    },
    {
      name: 'Kế hoạch dự án.xlsx',
      type: 'Excel',
      date: 'Đã đánh dấu',
      icon: '📊'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  showStorageMenu = false;
  toggleStorageMenu() {
    this.showStorageMenu = !this.showStorageMenu;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

}