import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;
  private readonly authClient: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!url || !serviceRoleKey) {
      throw new InternalServerErrorException(
        'Supabase is not configured. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.',
      );
    }

    this.client = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    if (!anonKey) {
      throw new InternalServerErrorException(
        'Supabase anon key is not configured. Missing SUPABASE_ANON_KEY.',
      );
    }

    this.authClient = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  get authAdmin() {
    return this.client.auth.admin;
  }

  get auth() {
    return this.authClient.auth;
  }
}
