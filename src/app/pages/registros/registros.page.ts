import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonButton, IonFab, IonFabButton, IonIcon, IonSkeletonText,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegistrosService, Registro } from '../../services/registros.service';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.page.html',
  styleUrls: ['./registros.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonButton, IonFab, IonFabButton, IonIcon, IonSkeletonText
  ]
})
export class RegistrosPage implements OnInit {

  registros: Registro[] = [];
  cargando = true;

  constructor(
    private registrosService: RegistrosService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.cargando = true;
    try {
      this.registros = await this.registrosService.listar();
    } catch (error) {
      console.error('Error al cargar registros:', error);
    } finally {
      this.cargando = false;
    }
  }

  agregarRegistro() {
    this.router.navigate(['/registro-form']);
  }

  async confirmarEliminar(id: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar registro?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(id)
        }
      ]
    });
    await alert.present();
  }

  async eliminar(id: number) {
    try {
      await this.registrosService.eliminar(id);
      this.registros = this.registros.filter(r => r.id !== id);
      const toast = await this.toastCtrl.create({
        message: '🗑️ Registro eliminado',
        duration: 2000,
        color: 'medium',
        position: 'top'
      });
      await toast.present();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  }
}