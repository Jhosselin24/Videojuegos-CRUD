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
  IonCardContent
} from '@ionic/angular/standalone';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideojuegosService, Videojuego } from '../../services/videojuegos';

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
    IonCardContent
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
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.videojuego = await this.videojuegosService.obtenerPorId(this.id);
    }
  }

  async guardar() {
    if (!this.videojuego.titulo || !this.videojuego.plataforma) {
      alert('Completa los campos obligatorios');
      return;
    }

    if (this.id) {
      await this.videojuegosService.actualizar(this.id, this.videojuego);
    } else {
      await this.videojuegosService.crear(this.videojuego);
    }

    this.router.navigate(['/videojuegos']);
  }
}