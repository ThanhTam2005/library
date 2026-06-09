import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {

  user: any;

  showUsers() {
    this.user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
  }
}