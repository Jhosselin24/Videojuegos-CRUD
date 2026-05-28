import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonFab, IonFabButton, IonSkeletonText,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EncuestasService, Encuesta } from '../../services/encuestas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.page.html',
  styleUrls: ['./encuestas.page.scss'],
  standalone: true,
  imports: [
    CommonModule, TitleCasePipe, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonFab, IonFabButton, IonSkeletonText
  ]
})
export class EncuestasPage {

  encuestas: Encuesta[] = [];
  cargando = true;

  get totalJuegos() {
    return new Set(this.encuestas.map(e => e.videojuego.toLowerCase())).size;
  }
  get totalConFoto() {
    return this.encuestas.filter(e => e.foto_url).length;
  }

  constructor(
    private svc: EncuestasService,
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() { this.cargar(); }

  async cargar() {
    this.cargando = true;
    try { this.encuestas = await this.svc.listar(); }
    catch (e) { console.error(e); }
    finally { this.cargando = false; }
  }

  nueva() { this.router.navigate(['/encuesta-form']); }

  async confirmarEliminar(id: number) {
    const a = await this.alertCtrl.create({
      header: '¿Eliminar encuesta?', message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.eliminar(id) }
      ]
    });
    await a.present();
  }

  async eliminar(id: number) {
    try {
      await this.svc.eliminar(id);
      this.encuestas = this.encuestas.filter(e => e.id !== id);
      const t = await this.toastCtrl.create({ message: '🗑️ Eliminada', duration: 2000, color: 'medium', position: 'top' });
      await t.present();
    } catch (e) { console.error(e); }
  }

  async cerrarSesion() {
    const a = await this.alertCtrl.create({
      header: 'Cerrar sesión', message: '¿Deseas salir de tu cuenta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', handler: async () => {
          await this.auth.cerrarSesion();
          this.router.navigate(['/login'], { replaceUrl: true });
        }}
      ]
    });
    await a.present();
  }
}