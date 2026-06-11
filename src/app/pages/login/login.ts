import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  user = {
    email: '',
    password: ''
  };

  admin = {
    email: 'admin@gmail.com',
    password: 'admin123'
  };

  showPassword = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  goRegister() {
    this.router.navigate(['/register']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  login() {

    if (this.user.email.trim() === '') {
      alert('Vui lòng nhập email!');
      return;
    }

    if (this.user.password.trim() === '') {
      alert('Vui lòng nhập mật khẩu!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.user.email)) {
      alert('Email không đúng định dạng!');
      return;
    }

    // Kiểm tra admin
    if (
      this.user.email === this.admin.email &&
      this.user.password === this.admin.password
    ) {
      alert('Đăng nhập Admin thành công!');
      const adminUser = { name: 'Admin', email: this.admin.email };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      this.router.navigate(['/home']);
      return;
    }

    // Kiểm tra user
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (
      this.user.email === savedUser.email &&
      this.user.password === savedUser.password
    ) {
      alert('Đăng nhập thành công!');

      const currentUser = {
        name: savedUser.fullName || savedUser.name || 'Người dùng',
        email: savedUser.email
      };

      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      const redirect = this.route.snapshot.queryParamMap.get('redirect');

      if (redirect === 'upload') {
        this.router.navigate(['/upload']);
      } else if (redirect) {
        this.router.navigate(['/home'], {
          queryParams: { section: redirect }
        });
      } else {
        this.router.navigate(['/home']);
      }

    } else {
      alert('Sai email hoặc mật khẩu!');
    }
  }
}