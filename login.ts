import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  user = {
    email: '',
    password: ''
  };

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

  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (
    this.user.email === savedUser.email &&
    this.user.password === savedUser.password
  ) {
    alert('Đăng nhập thành công!');
  } else {
    alert('Sai email hoặc mật khẩu!');
  }
}
}