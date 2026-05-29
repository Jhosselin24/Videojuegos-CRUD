import { Component } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  ToastController
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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
  ]
})

export class PromoPage {

  // ⚠️ CAMBIA ESTE LINK POR EL REAL DE TU APK
  readonly enlaceDescarga =
'https://github.com/TU-USUARIO/TU-REPO/releases/download/v1.0/app-debug.apk';

  constructor(
    private toastCtrl: ToastController
  ) {}

  async compartir() {

    try {

      await Share.share({

        title: '🎮 GameCampus',

        text:
'Estamos probando una app gamer desarrollada en Ionic. ¡Descárgala aquí!',

        url: this.enlaceDescarga,

        dialogTitle: 'Compartir app'

      });

    } catch {

      this.mostrarToast(
        'No se pudo compartir',
        'danger'
      );

    }

  }

  async copiarEnlace() {

    try {

      await Clipboard.write({
        string: this.enlaceDescarga
      });

      this.mostrarToast(
        '✅ Enlace copiado',
        'success'
      );

    } catch {

      try {

        await navigator.clipboard.writeText(
          this.enlaceDescarga
        );

        this.mostrarToast(
          '✅ Enlace copiado',
          'success'
        );

      } catch {

        this.mostrarToast(
          '❌ No se pudo copiar',
          'danger'
        );

      }

    }

  }

  private async mostrarToast(
    message: string,
    color: string
  ) {

    const toast =
      await this.toastCtrl.create({

        message,
        duration: 2500,
        color,
        position: 'top'

      });

    await toast.present();

  }

}