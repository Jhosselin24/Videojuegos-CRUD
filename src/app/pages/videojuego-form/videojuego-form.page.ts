import { Component, OnInit } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  VideojuegosService,
  Videojuego
} from '../../services/videojuegos';

@Component({
  selector: 'app-videojuego-form',
  templateUrl: './videojuego-form.page.html',
  styleUrls: ['./videojuego-form.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,

    IonItem,
    IonLabel,
    IonInput,

    IonButton,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,

    IonButtons,
    IonBackButton
  ]
})

export class VideojuegoFormPage implements OnInit {

  id?: number;

  videojuego: Videojuego = {
    titulo: '',
    plataforma: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagen_url: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videojuegosService: VideojuegosService
  ) {}

  async ngOnInit() {

    const idParam =
      this.route.snapshot.paramMap.get('id');

    if (idParam) {

      this.id = Number(idParam);

      this.videojuego =
        await this.videojuegosService.obtenerPorId(
          this.id
        );
    }
  }

  async guardar() {

    if (
      !this.videojuego.titulo ||
      !this.videojuego.plataforma
    ) {

      alert('Completa los campos obligatorios');

      return;
    }

    try {

      if (this.id) {

        await this.videojuegosService.actualizar(
          this.id,
          this.videojuego
        );

      } else {

        await this.videojuegosService.crear(
          this.videojuego
        );

      }

      // Redirección correcta
      this.router.navigate(['/tabs/videojuegos']);

    } catch (error) {

      console.error(error);

      alert('❌ Error al guardar videojuego');

    }
  }
}