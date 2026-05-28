import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.page.html',
  styleUrls: ['./promo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon
  ]
})
export class PromoPage {

  // Reemplaza con tu URL real de descarga / landing page
  readonly enlaceDescarga = 'https://gamecampus.app/descarga';

  constructor(private toastCtrl: ToastController) {}

  async compartir() {
    try {
      await Share.share({
        title: '🎮 GameCampus - La app gamer de tu universidad',
        text: '¡Únete a GameCampus! Registra tus videojuegos favoritos y conecta con gamers del campus. Descarga la app de prueba gratis:',
        url: this.enlaceDescarga,
        dialogTitle: 'Compartir GameCampus'
      });
    } catch (error) {
      // El usuario canceló o el dispositivo no soporta Share API
      this.mostrarToast('No se pudo abrir el menú de compartir', 'medium');
    }
  }

  async copiarEnlace() {
    try {
      await Clipboard.write({ string: this.enlaceDescarga });
      this.mostrarToast('✅ Enlace copiado al portapapeles', 'success');
    } catch (error) {
      // Fallback para web
      try {
        await navigator.clipboard.writeText(this.enlaceDescarga);
        this.mostrarToast('✅ Enlace copiado al portapapeles', 'success');
      } catch {
        this.mostrarToast('No se pudo copiar el enlace', 'danger');
      }
    }
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