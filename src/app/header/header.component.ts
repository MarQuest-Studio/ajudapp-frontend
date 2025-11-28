import { Component, inject } from '@angular/core';
import { KeycloakService } from '../core/services/keycloak.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent {
  keycloakService = inject(KeycloakService);
}
