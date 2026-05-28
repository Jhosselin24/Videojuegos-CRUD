import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Registro {
  id?: number;
  nombre: string;
  carrera?: string;
  email?: string;
  videojuego_favorito?: string;
  plataforma_favorita?: string;
  foto_url?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrosService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async listar(): Promise<Registro[]> {
    const { data, error } = await this.supabase
      .from('registros')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Registro[];
  }

  async crear(registro: Registro): Promise<Registro> {
    const { data, error } = await this.supabase
      .from('registros')
      .insert(registro)
      .select()
      .single();

    if (error) throw error;
    return data as Registro;
  }

  async eliminar(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('registros')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Sube una foto (base64 o Blob) al bucket 'evidencias' de Supabase Storage
   * y devuelve la URL pública.
   */
  async subirFoto(base64Data: string, fileName: string): Promise<string> {
    // Convertir base64 a Blob
    const base64Response = await fetch(base64Data);
    const blob = await base64Response.blob();

    const filePath = `fotos/${Date.now()}_${fileName}`;

    const { error } = await this.supabase.storage
      .from('evidencias')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = this.supabase.storage
      .from('evidencias')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }
}