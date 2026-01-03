import { AfterViewInit, Component } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  standalone: true
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([38.7223, -9.1393], 12); // Lisbon

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Example marker
    // L.marker([38.7223, -9.1393])
    //   .addTo(this.map)
    //   .bindPopup('Lisboa');
    L.circle([38.7223, -9.1393], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(this.map);
  }
}
