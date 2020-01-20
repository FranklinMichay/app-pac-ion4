
import { Injectable, ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class UbicacionService{
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/streets-v11`;
  // Coordenadas de la localización donde queremos centrar el mapa
  lat = -4.011562;
  lng = -79.203182;
  zoom = 15;
  constructor() {
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapbox.accessToken;
  }



  buildMap(map) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/bright-v9',
      zoom: this.zoom,
      center: [this.lng, this.lat],
      attributionControl: false
    });
    this.addMarker();
    // this.map.addControl(new mapboxgl.NavigationControl());
    // this.map.addControl(new mapboxgl.FullscreenControl());
    }


    addMarker() {
      let el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = "url('assets/markers/mark.png')";
      el.style.backgroundSize = 'cover';
      el.style.width = '90px';
      el.style.height = '90px';
  
  
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat([this.lng, this.lat])
        .addTo(this.map);
  
  
    }
}