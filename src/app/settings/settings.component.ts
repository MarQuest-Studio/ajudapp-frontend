import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  activeTab = 'profile';

  settingsNav = [
    { id: 'profile', label: 'Profile', icon: 'person-fill' },
    { id: 'security', label: 'Security', icon: 'lock-fill' },
    { id: 'notifications', label: 'Notifications', icon: 'bell-fill' },
    { id: 'privacy', label: 'Privacy', icon: 'shield-check' },
  ];

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
}
