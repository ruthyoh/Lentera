import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/health
 * Endpoint diagnostik koneksi Supabase.
 */
export async function GET() {
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  let adminClientResult: { ok: boolean; message?: string; error?: string } = {
    ok: false,
  };
  let serverClientResult: { ok: boolean; message?: string; error?: string } = {
    ok: false,
  };
  let sessionResult: { logged_in: boolean; user_id?: string; email?: string } = {
    logged_in: false,
  };

  // Cek 1: Admin Client
  try {
    if (envStatus.SUPABASE_SERVICE_ROLE_KEY && envStatus.NEXT_PUBLIC_SUPABASE_URL) {
      const admin = createAdminClient();
      const { error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
      if (error) {
        adminClientResult = { ok: false, error: error.message };
      } else {
        adminClientResult = { ok: true, message: 'Admin client terhubung sukses.' };
      }
    } else {
      adminClientResult = { ok: false, error: 'Environment variables belum lengkap.' };
    }
  } catch (err) {
    adminClientResult = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // Cek 2: Server Client
  try {
    if (envStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY && envStatus.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error && !error.message.includes('Auth session missing')) {
        serverClientResult = { ok: false, error: error.message };
      } else {
        serverClientResult = { ok: true, message: 'Server client terhubung sukses.' };
      }

      if (user) {
        sessionResult = { logged_in: true, user_id: user.id, email: user.email };
      }
    } else {
      serverClientResult = { ok: false, error: 'Environment variables belum lengkap.' };
    }
  } catch (err) {
    serverClientResult = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  const overallOk =
    envStatus.NEXT_PUBLIC_SUPABASE_URL &&
    envStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    envStatus.SUPABASE_SERVICE_ROLE_KEY &&
    adminClientResult.ok &&
    serverClientResult.ok;

  return NextResponse.json({
    status: overallOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    env: envStatus,
    admin_client: adminClientResult,
    server_client: serverClientResult,
    session: sessionResult,
  });
}
