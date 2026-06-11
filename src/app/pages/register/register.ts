import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  constructor(private router: Router) {}

  private addActivityLog(message: string) {
    const savedActivityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    const activityList = Array.isArray(savedActivityLog) ? savedActivityLog : [];
    activityList.unshift({ message, timestamp: new Date().toISOString() });
    localStorage.setItem('activityLog', JSON.stringify(activityList));
  }

  user = {
    fullName: '',
    email: '',
    password: ''
  };
  confirmPassword = '';

  register() {

  // Kiểm tra họ tên
  if (this.user.fullName.trim() === '') {
    alert('Vui lòng nhập họ tên!');
    return;
  }

  // Kiểm tra email
  if (this.user.email.trim() === '') {
    alert('Vui lòng nhập email!');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(this.user.email)) {
    alert('Email không đúng định dạng!');
    return;
  }

  // Kiểm tra mật khẩu
  if (this.user.password.length < 6) {
    alert('Mật khẩu phải có ít nhất 6 ký tự!');
    return;
  }

  // Kiểm tra xác nhận mật khẩu
  if (this.user.password !== this.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }
  localStorage.setItem('user', JSON.stringify(this.user));
  const currentUser = {
    name: this.user.fullName,
    email: this.user.email
  };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  this.addActivityLog(`Đăng ký tài khoản mới ${this.user.email}`);
  alert('Đăng ký thành công!');
  this.router.navigate(['/home']);
  }
  showPassword = false;
  showConfirmPassword = false;
}