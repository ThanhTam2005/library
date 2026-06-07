import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  showProfileMenu = false;

  currentUser = {
    name: 'Người dùng',
    email: 'Chưa có email'
  };
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
    },
    {
      name: 'Slide thuyết trình.pptx',
      type: 'PowerPoint',
      searches: 63,
      description: 'Mẫu slide trình bày báo cáo, đồ án hoặc khóa luận.',
      icon: '📽'
    },
    {
      name: 'Tài liệu yêu cầu hệ thống.docx',
      type: 'Word',
      searches: 51,
      description: 'Tài liệu mô tả yêu cầu chức năng và phi chức năng của hệ thống.',
      icon: '📄'
    },
    {
      name: 'Biểu mẫu đăng ký.pdf',
      type: 'PDF',
      searches: 39,
      description: 'Các biểu mẫu thường dùng trong quá trình học tập và làm việc.',
      icon: '📕'
    }
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      this.currentUser = JSON.parse(userData);
    }

    const section = this.route.snapshot.queryParamMap.get('section');

    if (section) {
      this.currentSection = section;
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }


  showStorageMenu = false;
  toggleStorageMenu() {
    this.showStorageMenu = !this.showStorageMenu;
  }

  goToLoginForUpload() {
    this.router.navigate(['/login'], {
      queryParams: { redirect: 'upload' }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = {
      name: 'Khách truy cập',
      email: 'Chưa đăng nhập'
    };
    this.currentSection = 'home';
    this.router.navigate(['/home']);
  }

  currentSection = 'home';
  openSection(section: string) {
    this.currentSection = section;
    this.showStorageMenu = false;
  }

  goToProtectedSection(section: string) {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      this.openSection(section);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirect: section }
      });
    }
  }

  goToProtectedPage(page: string) {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      this.router.navigate(['/' + page]);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirect: page }
      });
    }
  }

}