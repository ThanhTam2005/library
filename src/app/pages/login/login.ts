import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  showPassword = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  goRegister() {
    this.router.navigate(['/register']);
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

    this.http.post<any>('http://localhost:3000/api/login', {
      email: this.user.email,
      password: this.user.password
    }).subscribe({
      next: (res) => {
        alert(res.message || 'Đăng nhập thành công!');

        localStorage.setItem('currentUser', JSON.stringify(res.user));

        const redirect = this.route.snapshot.queryParamMap.get('redirect');

        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
          return;
        }

        if (redirect === 'upload') {
          this.router.navigate(['/upload']);
        } else if (redirect) {
          this.router.navigate(['/home'], {
            queryParams: { section: redirect }
          });
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Sai email hoặc mật khẩu!');
      }
    });
  }
}