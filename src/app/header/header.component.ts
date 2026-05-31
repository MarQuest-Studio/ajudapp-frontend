import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakService } from '../core/services/keycloak.service';

@Component({
  selector: 'app-header',
  imports: [TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent {
  keycloakService = inject(KeycloakService);
}
