import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Encuesta {
  id?: number;
  user_id?: string;
  alias: string;
  edad_rango?: string;
  rol?: string;
  videojuego: string;
  plataforma?: string;
  genero_juego?: string;
  comentario?: string;
  foto_url?: string;
  latitud?: number;
  longitud?: number;
  lugar?: string;
  fecha_hora?: string;
  // Datos de API
  api_nombre?: string;
  api_imagen?: string;
  api_genero?: string;
  api_plataforma?: string;
  api_rating?: string;
  api_descripcion?: string;
}

export interface JuegoAPI {
  nombre: string;
  imagen: string;
  genero: string;
  plataforma: string;
  rating: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class EncuestasService {

  private supabase: SupabaseClient;
  // RAWG API - clave gratuita en rawg.io/apidocs
  private readonly RAWG_KEY = 'TU_RAWG_API_KEY'; // ← Reemplaza con tu key de rawg.io

  constructor(private auth: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ── CRUD ──────────────────────────────────────────────

  async listar(): Promise<Encuesta[]> {
    const { data, error } = await this.supabase
      .from('encuestas')
      .select('*')
      .order('fecha_hora', { ascending: false });
    if (error) throw error;
    return data as Encuesta[];
  }

  async crear(encuesta: Encuesta): Promise<Encuesta> {
    const userId = this.auth.currentUser?.id;
    const payload = { ...encuesta, user_id: userId, fecha_hora: new Date().toISOString() };
    const { data, error } = await this.supabase
      .from('encuestas').insert(payload).select().single();
    if (error) throw error;
    return data as Encuesta;
  }

  async eliminar(id: number): Promise<void> {
    const { error } = await this.supabase.from('encuestas').delete().eq('id', id);
    if (error) throw error;
  }

  // ── GPS ──────────────────────────────────────────────

  async obtenerUbicacion(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS no disponible'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  // ── STORAGE ───────────────────────────────────────────

  async subirFoto(base64Data: string, fileName: string): Promise<string> {
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();
    const filePath = `encuestas/${Date.now()}_${fileName}`;
    const { error } = await this.supabase.storage
      .from('evidencias').upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });
    if (error) throw error;
    const { data } = this.supabase.storage.from('evidencias').getPublicUrl(filePath);
    return data.publicUrl;
  }

  // ── API RAWG ──────────────────────────────────────────

  async buscarJuego(nombre: string): Promise<JuegoAPI | null> {
    try {
      const query = encodeURIComponent(nombre);
      const url = `https://api.rawg.io/api/games?key=${this.RAWG_KEY}&search=${query}&page_size=1`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.results || json.results.length === 0) return null;
      const g = json.results[0];
      return {
        nombre: g.name,
        imagen: g.background_image || '',
        genero: g.genres?.map((x: any) => x.name).join(', ') || '',
        plataforma: g.platforms?.map((x: any) => x.platform.name).join(', ') || '',
        rating: g.rating?.toString() || '',
        descripcion: `Rating: ${g.rating} | Metacritic: ${g.metacritic || 'N/D'}`
      };
    } catch {
      return null;
    }
  }

  // ── ALTERNATIVA GRATUITA SIN KEY: FreeToGame ──────────

  async buscarJuegoFreeToPlay(nombre: string): Promise<JuegoAPI | null> {
    try {
      const url = `https://www.freetogame.com/api/games?category=${encodeURIComponent(nombre)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) return null;
      // Buscar coincidencia aproximada por nombre
      const match = json.find((g: any) =>
        g.title.toLowerCase().includes(nombre.toLowerCase())
      ) || json[0];
      return {
        nombre: match.title,
        imagen: match.thumbnail,
        genero: match.genre,
        plataforma: match.platform,
        rating: 'N/D',
        descripcion: match.short_description
      };
    } catch {
      return null;
    }
  }
}