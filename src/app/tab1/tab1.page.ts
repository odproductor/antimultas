import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab1Page {

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 2000,
    },
  };

  picoyplaca = [
    {
      id: 0,
      title: 'Lunes',
      number: "1 - 2"
    },
    {
      id: 1,
      title: 'Martes',
      number: "3 - 4"
    },
    {
      id: 2,
      title: 'Miércoles',
      number: "5 - 6"
    },
    {
      id: 3,
      title: 'Jueves',
      number: "7 - 8"
    },
    {
      id: 4,
      title: 'Viernes',
      number: "9 - 0"
    },
    {
      id: 5,
      title: 'Sábado',
      number: "No Aplica"
    },
    {
      id: 6,
      title: 'Domingo',
      number: "No Aplica"
    }
  ];

  actualPicoYPlaca = this.picoyplaca[new Date().getDay()];

  questionList = [];
  questionListFeatured: any = [];

  enabled = false;
  lat = 7.8219508;
  lng = -72.5159326;

  diasfestivos = ["16/10/2023", "06/11/2023", "13/11/2023", "08/12/2023", "25/12/2023"];

  isFotomulta = true;
  isNear = false;

  fotoMultas: any = [];

  constructor(
    private alert: AlertController,
    private http: HttpClient,
    private nav: NavController
  ) {
    this.getFotomultasList();
    this.getFaqsList();
    this.actualPicoYPlaca = this.picoyplaca[new Date().getDay()];
    this.isFotomulta = this.diasfestivos.includes(new Date().toLocaleDateString());
  }

  getFotomultasList() {
    this.http.get('https://www.encontrable.com/analisis/controllers/getFotos.php').subscribe((result: any) => {
      this.fotoMultas = result;
      this.checkIfFotomultaisNear();
      localStorage.setItem('fotomultas', JSON.stringify(result));
    });
  }

  getFaqsList() {
    this.http.get('https://www.encontrable.com/analisis/controllers/getFaqs.php').subscribe((result: any) => {
      this.questionList = result;
      this.questionListFeatured = result.filter((item: any) => item.featured == 1);
      localStorage.setItem('faqs', JSON.stringify(result));
    });
  }

  ionViewDidEnter(){
    //check if has permission to access location
    Geolocation.checkPermissions().then((result) => {
      console.log("habilitado",result);
      if(result.location == "granted"){
        this.enabled = true;
        this.startLocationWatch();
      } else {
        this.enabled = false;
        Geolocation.requestPermissions().then((result) => {
          console.log("habilitado2",result);
          if(result.location == "granted"){
            this.enabled = true;
            this.startLocationWatch();
          } else {
            this.enabled = false;
            //show msg open settings location when click in open
            this.alert.create({
              header: 'Info',
              message: 'Para enviar la ubicación debe habilitar el GPS',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancelar');
                  }
                },
                {
                  text: 'Abrir',
                  handler: () => {
                    console.log('Abrir');
                    NativeSettings.open({
                      optionAndroid: AndroidSettings.ApplicationDetails, 
                      optionIOS: IOSSettings.App
                    })
                  }
                }
              ]
            }).then(res => {
              res.present();
            });
            
          }
        });
      }
    });
  }

  startLocationWatch() {
    Geolocation.watchPosition({}, (position:any, err) => {
      console.log(position);
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.checkIfFotomultaisNear();
    });
  }

  getLocation() {
    Geolocation.getCurrentPosition().then((result) => {
      console.log(result);
      this.lat = result.coords.latitude;
      this.lng = result.coords.longitude;
      this.checkIfFotomultaisNear();
    });
  }

  checkIfFotomultaisNear() {
    this.isNear = false;
    this.fotoMultas.forEach((element:any) => {
      if (this.getDistanceFromLatLonInKm(this.lat, this.lng, element.lat, element.lng) < 1) {
        this.isNear = true;
      }
    });
  }

  getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
    var R = 6371; // Radius of the earth in km 
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below 
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km 
  }

  deg2rad(deg: any) {
    return deg * (Math.PI / 180)
  }

  showAnswer(question: any) {
    localStorage.setItem("question", JSON.stringify(question));
    this.nav.navigateForward(`/faqs`);
  }

  


}
