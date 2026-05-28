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
    const payload = {
      ...encuesta,
      user_id: userId,
      fecha_hora: new Date().toISOString()
    };
    const { data, error } = await this.supabase
      .from('encuestas')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Encuesta;
  }

  async eliminar(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('encuestas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  // ── GPS ──────────────────────────────────────────────

  async obtenerUbicacion(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS no disponible en este dispositivo'));
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
      .from('evidencias')
      .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });
    if (error) throw error;
    const { data } = this.supabase.storage
      .from('evidencias')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  // ── API RAWG (con tu key real) ─────────────────────────
  // Regístrate gratis en https://rawg.io/apidocs para obtener tu key
  // y reemplaza el valor en environment.ts: rawgKey: 'TU_KEY_AQUI'

  async buscarJuego(nombre: string): Promise<JuegoAPI | null> {
    try {
      const key = (environment as any).rawgKey;
      if (!key || key === 'TU_KEY_AQUI') {
        // Sin key de RAWG, ir directo al fallback
        return await this.buscarJuegoFreeToPlay(nombre);
      }
      const query = encodeURIComponent(nombre);
      const url = `https://api.rawg.io/api/games?key=${key}&search=${query}&page_size=1`;
      const res = await fetch(url);
      if (!res.ok) return await this.buscarJuegoFreeToPlay(nombre);
      const json = await res.json();
      if (!json.results || json.results.length === 0) {
        return await this.buscarJuegoFreeToPlay(nombre);
      }
      const g = json.results[0];
      return {
        nombre: g.name,
        imagen: g.background_image || '',
        genero: g.genres?.map((x: any) => x.name).join(', ') || 'N/D',
        plataforma: g.platforms?.map((x: any) => x.platform.name).join(', ') || 'N/D',
        rating: g.rating ? g.rating.toFixed(1) + ' / 5' : 'N/D',
        descripcion: `Metacritic: ${g.metacritic || 'N/D'} | Lanzamiento: ${g.released || 'N/D'}`
      };
    } catch {
      return await this.buscarJuegoFreeToPlay(nombre);
    }
  }

  // ── FreeToGame — búsqueda correcta por nombre ─────────
  // Documentación: https://www.freetogame.com/api-doc

  async buscarJuegoFreeToPlay(nombre: string): Promise<JuegoAPI | null> {
    try {
      // FreeToGame no tiene búsqueda por texto, descargamos la lista y filtramos
      const url = 'https://www.freetogame.com/api/games';
      const res = await fetch(url);
      if (!res.ok) return await this.buscarConOpenLibre(nombre);
      const json: any[] = await res.json();
      if (!Array.isArray(json) || json.length === 0) {
        return await this.buscarConOpenLibre(nombre);
      }

      const nombreLower = nombre.toLowerCase();

      // Primero buscar coincidencia exacta en el título
      let match = json.find((g: any) =>
        g.title.toLowerCase() === nombreLower
      );

      // Si no hay exacta, buscar que incluya el texto
      if (!match) {
        match = json.find((g: any) =>
          g.title.toLowerCase().includes(nombreLower)
        );
      }

      // Si tampoco, buscar que el texto incluya alguna palabra del título
      if (!match) {
        const palabras = nombreLower.split(' ').filter(p => p.length > 3);
        match = json.find((g: any) =>
          palabras.some(p => g.title.toLowerCase().includes(p))
        );
      }

      if (!match) {
        return await this.buscarConOpenLibre(nombre);
      }

      return {
        nombre: match.title,
        imagen: match.thumbnail || '',
        genero: match.genre || 'N/D',
        plataforma: match.platform || 'N/D',
        rating: 'Gratis',
        descripcion: match.short_description || 'Sin descripción disponible'
      };
    } catch {
      return await this.buscarConOpenLibre(nombre);
    }
  }

  // ── Fallback: OpenLibre / CheapShark para juegos de PC ─
  // No requiere API key — https://apidocs.cheapshark.com

  async buscarConOpenLibre(nombre: string): Promise<JuegoAPI | null> {
    try {
      const query = encodeURIComponent(nombre);
      const url = `https://www.cheapshark.com/api/1.0/games?title=${query}&limit=1`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const json: any[] = await res.json();
      if (!Array.isArray(json) || json.length === 0) return null;

      const g = json[0];
      // CheapShark no da imagen directa — usamos Steam si hay steamAppID
      const imagen = g.steamAppID
        ? `https://cdn.akamai.steamstatic.com/steam/apps/${g.steamAppID}/header.jpg`
        : '';

      return {
        nombre: g.external || nombre,
        imagen,
        genero: 'PC / Steam',
        plataforma: 'PC',
        rating: g.cheapest ? `Desde $${g.cheapest}` : 'N/D',
        descripcion: `Mejor precio: $${g.cheapest || 'N/D'} en ${g.cheapestDealID ? 'tienda online' : 'N/D'}`
      };
    } catch {
      return null;
    }
  }
}