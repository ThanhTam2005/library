import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  user = {
    fullName: '',
    email: '',
    password: ''
  };

  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  private addActivityLog(message: string) {
    const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    const activityList = Array.isArray(savedActivityLog) ? savedActivityLog : [];

    activityList.unshift({
      message,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('activityLog', JSON.stringify(activityList));
  }

  register() {

    if (this.user.fullName.trim() === '') {
      alert('Vui lòng nhập họ tên!');
      return;
    }

    if (this.user.email.trim() === '') {
      alert('Vui lòng nhập email!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.user.email)) {
      alert('Email không đúng định dạng!');
      return;
    }

    if (this.user.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    const registerData = {
      fullName: this.user.fullName,
      email: this.user.email,
      password: this.user.password
    };

    this.http.post<any>('http://localhost:3000/api/register', registerData)
      .subscribe({
        next: (res) => {
          this.addActivityLog(`Đăng ký tài khoản mới ${this.user.email}`);

          alert(res.message || 'Đăng ký thành công!');

          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(err.error?.message || 'Đăng ký thất bại!');
        }
      });
  }
}