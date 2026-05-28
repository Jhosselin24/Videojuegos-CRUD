import { Component } from '@angular/core';
import {
  IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSpinner]
})
export class LoginPage {
  modo: 'login' | 'registro' = 'login';
  email = '';
  password = '';
  confirm = '';
  verPassword = false;
  cargando = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completa email y contraseña.'; return;
    }
    this.cargando = true; this.errorMsg = '';
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/tabs/encuestas'], { replaceUrl: true });
    } catch (e: any) {
      this.errorMsg = this.traducirError(e.message);
    } finally { this.cargando = false; }
  }

  async registrar() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completa todos los campos.'; return;
    }
    if (this.password !== this.confirm) {
      this.errorMsg = 'Las contraseñas no coinciden.'; return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.'; return;
    }
    this.cargando = true; this.errorMsg = '';
    try {
      await this.auth.registrar(this.email, this.password);
      const toast = await this.toastCtrl.create({
        message: '✅ Cuenta creada. Revisa tu email para confirmar.',
        duration: 4000, color: 'success', position: 'top'
      });
      await toast.present();
      this.modo = 'login';
    } catch (e: any) {
      this.errorMsg = this.traducirError(e.message);
    } finally { this.cargando = false; }
  }

  private traducirError(msg: string): string {
    if (msg.includes('Invalid login')) return 'Email o contraseña incorrectos.';
    if (msg.includes('already registered')) return 'Este email ya tiene una cuenta.';
    if (msg.includes('valid email')) return 'Ingresa un email válido.';
    return msg;
  }
}