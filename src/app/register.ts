import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  constructor(private router: Router) {}

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
  alert('Đăng ký thành công!');
  this.router.navigate(['/login']);
  }
}