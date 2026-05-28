import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton,
  IonSelect, IonSelectOption, IonIcon, IonSpinner,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { RegistrosService, Registro } from '../../services/registros.service';

@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.page.html',
  styleUrls: ['./registro-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton,
    IonSelect, IonSelectOption, IonIcon, IonSpinner
  ]
})
export class RegistroFormPage {

  registro: Registro = {
    nombre: '',
    carrera: '',
    email: '',
    videojuego_favorito: '',
    plataforma_favorita: ''
  };

  fotoPreview: string | undefined;
  fotoBase64: string | undefined;
  guardando = false;

  constructor(
    private registrosService: RegistrosService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera   // Cambia a Prompt para elegir entre cámara/galería
      });

      this.fotoPreview = image.dataUrl;
      this.fotoBase64 = image.dataUrl;

    } catch (error: any) {
      // El usuario canceló o no hay permisos
      if (error?.message !== 'User cancelled photos app') {
        this.mostrarToast('No se pudo acceder a la cámara', 'warning');
      }
    }
  }

  async guardar() {
    if (!this.registro.nombre.trim()) {
      this.mostrarAlerta('Campo requerido', 'El nombre es obligatorio.');
      return;
    }

    this.guardando = true;

    try {
      // 1. Subir foto si existe
      if (this.fotoBase64) {
        const nombreArchivo = `registro_${Date.now()}.jpg`;
        this.registro.foto_url = await this.registrosService.subirFoto(
          this.fotoBase64,
          nombreArchivo
        );
      }

      // 2. Guardar registro en Supabase
      await this.registrosService.crear(this.registro);

      this.mostrarToast('✅ Registro guardado exitosamente', 'success');
      this.router.navigate(['/tabs/registros']);

    } catch (error) {
      console.error('Error al guardar registro:', error);
      this.mostrarToast('❌ Error al guardar. Intenta de nuevo.', 'danger');
    } finally {
      this.guardando = false;
    }
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  private async mostrarToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    await toast.present();
  }
}