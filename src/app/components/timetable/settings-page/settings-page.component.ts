import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
  standalone: true
})
export class SettingsPageComponent {}
