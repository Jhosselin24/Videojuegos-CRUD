import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonSpinner,
  AlertController, ToastController
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import {
  EncuestasService,
  Encuesta,
  JuegoAPI
} from '../../services/encuestas.service';

@Component({
  selector: 'app-encuesta-form',
  templateUrl: './encuesta-form.page.html',
  styleUrls: ['./encuesta-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,

    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,

    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class EncuestaFormPage {

  enc: Encuesta = {
    alias: '',
    videojuego: '',
    lugar: '',
    edad_rango: '',
    rol: '',
    plataforma: '',
    genero_juego: '',
    comentario: ''
  };

  fechaHoy = new Date().toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  fotoPreview?: string;
  fotoBase64?: string;

  juegoAPI?: JuegoAPI;

  apiSinResultado = false;
  gpsOk = false;
  buscandoApi = false;
  guardando = false;

  constructor(
    private svc: EncuestasService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async obtenerGPS() {
    try {

      const pos = await this.svc.obtenerUbicacion();

      this.enc.latitud = pos.lat;
      this.enc.longitud = pos.lng;

      this.gpsOk = true;

      this.toast('📍 Ubicación capturada', 'success');

    } catch {

      this.toast(
        'No se pudo obtener la ubicación GPS',
        'warning'
      );

    }
  }

  async tomarFoto(fuente: 'camera' | 'gallery') {

    try {

      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source:
          fuente === 'camera'
            ? CameraSource.Camera
            : CameraSource.Photos
      });

      this.fotoPreview = image.dataUrl!;
      this.fotoBase64 = image.dataUrl!;

    } catch (e: any) {

      if (!e?.message?.includes('cancelled')) {

        this.toast(
          'No se pudo acceder a la cámara/galería',
          'warning'
        );

      }
    }
  }

  async buscarEnAPI() {

    if (!this.enc.videojuego?.trim()) return;

    this.buscandoApi = true;

    this.juegoAPI = undefined;
    this.apiSinResultado = false;

    try {

      // Buscar primero en RAWG
      let resultado = await this.svc.buscarJuego(
        this.enc.videojuego
      );

      // Si no encuentra, buscar en FreeToGame
      if (!resultado) {

        resultado = await this.svc.buscarJuegoFreeToPlay(
          this.enc.videojuego
        );

      }

      if (resultado) {

        this.juegoAPI = resultado;

        // Guardar datos API
        this.enc.api_nombre = resultado.nombre;
        this.enc.api_imagen = resultado.imagen;
        this.enc.api_genero = resultado.genero;
        this.enc.api_plataforma = resultado.plataforma;
        this.enc.api_rating = resultado.rating;
        this.enc.api_descripcion = resultado.descripcion;

      } else {

        this.apiSinResultado = true;

      }

    } finally {

      this.buscandoApi = false;

    }
  }

  async guardar() {

    if (
      !this.enc.alias.trim() ||
      !this.enc.videojuego.trim()
    ) {

      const alert = await this.alertCtrl.create({
        header: 'Campos requeridos',
        message:
          'El alias y el videojuego favorito son obligatorios.',
        buttons: ['OK']
      });

      await alert.present();

      return;
    }

    this.guardando = true;

    try {

      // Subir foto
      if (this.fotoBase64) {

        this.enc.foto_url =
          await this.svc.subirFoto(
            this.fotoBase64,
            `enc_${Date.now()}.jpg`
          );

      }

      // Guardar encuesta
      await this.svc.crear(this.enc);

      this.toast(
        '✅ Encuesta guardada',
        'success'
      );

      this.router.navigate(['/tabs/encuestas']);

    } catch (e) {

      console.error(e);

      this.toast(
        '❌ Error al guardar. Intenta de nuevo.',
        'danger'
      );

    } finally {

      this.guardando = false;

    }
  }

  private async toast(
    message: string,
    color: string
  ) {

    const t = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });

    await t.present();
  }
}