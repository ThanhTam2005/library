import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

goRegister() {
  this.router.navigate(['/register']);
}

showPassword = false;
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
  //kiểm tra admin
  if (
  this.user.email === this.admin.email &&
  this.user.password === this.admin.password
) {
  alert('Đăng nhập Admin thành công!');
  this.router.navigate(['/admin']);
  return;
}

//kiểm tra user
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