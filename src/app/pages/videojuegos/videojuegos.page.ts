import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideojuegosService, Videojuego } from '../../services/videojuegos';

@Component({
  selector: 'app-videojuegos',
  templateUrl: './videojuegos.page.html',
  styleUrls: ['./videojuegos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent
  ]
})
export class VideojuegosPage implements OnInit {

  videojuegos: Videojuego[] = [];

  constructor(
    private videojuegosService: VideojuegosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargar();
  }

  ionViewWillEnter() {
    this.cargar();
  }

  async cargar() {
    this.videojuegos = await this.videojuegosService.listar();
  }

  async eliminarJuego(id: number) {
    await this.videojuegosService.eliminar(id);
    await this.cargar();
  }

  editarJuego(juego: Videojuego) {
    this.router.navigate(['/videojuegos-form', juego.id]);
  }

  agregarJuego() {
    this.router.navigate(['/videojuegos-form']);
  }
}