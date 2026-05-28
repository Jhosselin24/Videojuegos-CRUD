import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private supabase: SupabaseClient;
  private _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Mantener sesión activa: escucha cambios de sesión
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._user.next(session?.user ?? null);
    });

    // Cargar sesión existente al arrancar
    this.supabase.auth.getSession().then(({ data }) => {
      this._user.next(data.session?.user ?? null);
    });
  }

  get currentUser(): User | null {
    return this._user.getValue();
  }

  async registrar(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async cerrarSesion() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async sesionActual(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }
}