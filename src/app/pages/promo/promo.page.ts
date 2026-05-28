import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

declare var QRCode: any;

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
export class PromoPage implements OnInit {

  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef;

  // IMPORTANTE: Reemplaza con tu URL real de Firebase Hosting o APK en GitHub
  // Ejemplo Firebase: 'https://TU-PROYECTO.web.app'
  // Ejemplo APK GitHub: 'https://github.com/TU-USUARIO/TU-REPO/releases/latest'
  readonly enlaceDescarga = 'https://ghyexoljgghutsbrwbua.supabase.co'; // ← cambia por tu URL real
  qrGenerado = false;

  constructor(private toastCtrl: ToastController) {}

  ngOnInit() {
    this.cargarQRLibrary();
  }

  private cargarQRLibrary() {
    // Carga la librería qrcode.js dinámicamente
    if (typeof QRCode !== 'undefined') {
      setTimeout(() => this.generarQR(), 300);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = () => setTimeout(() => this.generarQR(), 300);
    document.head.appendChild(script);
  }

  private generarQR() {
    const container = document.getElementById('qr-container');
    if (!container || typeof QRCode === 'undefined') return;
    container.innerHTML = '';
    try {
      new QRCode(container, {
        text: this.enlaceDescarga,
        width: 160,
        height: 160,
        colorDark: '#1d4ed8',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
      this.qrGenerado = true;
    } catch (e) {
      console.error('Error generando QR:', e);
    }
  }

  async compartir() {
    try {
      await Share.share({
        title: '🎮 GameCampus - La app gamer de tu universidad',
        text: '¡Únete a GameCampus! Registra tus videojuegos favoritos y conecta con gamers del campus. Descarga la app gratis:',
        url: this.enlaceDescarga,
        dialogTitle: 'Compartir GameCampus'
      });
    } catch (error) {
      this.mostrarToast('No se pudo abrir el menú de compartir', 'medium');
    }
  }

  async copiarEnlace() {
    try {
      await Clipboard.write({ string: this.enlaceDescarga });
      this.mostrarToast('✅ Enlace copiado al portapapeles', 'success');
    } catch (error) {
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