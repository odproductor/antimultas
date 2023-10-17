import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
declare var google: any;
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class Tab2Page {

  map: any;
  zoom = 15;
  lat = 7.8219508;
  lng = -72.5159326;

  fotoMultas: any = [];

  markerMyPosition: any;

  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  constructor() {
    
  }

  ionViewDidEnter(){
    this.initMaps();
    this.fotoMultas = localStorage.getItem("fotomultas") ? JSON.parse(localStorage.getItem("fotomultas") ?? '[]') : [];
    
  }

  startLocationWatch() {
    Geolocation.watchPosition({}, (position:any, err) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.updateMap();
      this.clearMarkerMyLocation();
      this.createMarkerMyLocation();
    });
  }

  async initMaps() {
    console.log("initMaps");
    setTimeout(() => {
      console.log("initMaps2");
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: this.lat, lng: this.lng },
        zoom: this.zoom,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });
      setTimeout(() => this.startLocationWatch(), 500);
      this.createMarkers();
      this.createMarkerMyLocation();
    }, 1000);
  }

  createMarkers() {
    this.fotoMultas.forEach((fotoMulta: any) => {
      const marker = new google.maps.Marker({
        position: { lat: fotoMulta.lat, lng: fotoMulta.lng },
        map: this.map,
        title: fotoMulta.name,
        icon: "assets/img/alerta.png"
      });
    });
  }

  createMarkerMyLocation() {
    this.markerMyPosition = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      title: "Mi ubicación",
      icon: "assets/img/person.png"
    });
  }

  clearMarkerMyLocation() {
    this.markerMyPosition.setMap(null);
  }
    

  updateMap() {
    this.map.panTo({ lat: this.lat, lng: this.lng });
  }

}
