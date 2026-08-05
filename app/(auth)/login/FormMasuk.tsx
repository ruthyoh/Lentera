'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { masukAkun } from '@/lib/actions/auth';
import Input from '@/components/ui/Input';
import Tombol from '@/components/ui/Button';
import type { AuthState } from '@/types';

const initialState: AuthState = {};

export default function FormMasuk() {
  const [state, formAction, pending] = useActionState(masukAkun, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5"
      aria-label="Form masuk akun Lentera"
      noValidate
    >
      {/* Error global */}
      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-[var(--radius-sm)] text-sm"
          style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            color: '#b91c1c',
          }}
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Pesan sukses */}
      {state.sukses && state.pesan && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 rounded-[var(--radius-sm)] text-sm font-medium"
          style={{
            background: 'var(--color-gold-50)',
            border: '1px solid var(--color-gold-200)',
            color: 'var(--color-gold-900)',
          }}
        >
          <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-[var(--color-gold-600)]" />
          <span>{state.pesan}</span>
        </div>
      )}

      <Input
        id="email-masuk"
        name="email"
        label="Alamat Email"
        type="email"
        placeholder="mahasiswa@email.com"
        autoComplete="email"
        required
        ikonKiri={<Mail size={16} />}
        error={state.fieldErrors?.email}
        defaultValue=""
        aria-describedby={state.fieldErrors?.email ? 'email-masuk-error' : undefined}
      />

      <div>
        <Input
          id="kata-sandi-masuk"
          name="kata_sandi"
          label="Kata Sandi"
          type="password"
          placeholder="Masukkan kata sandi"
          autoComplete="current-password"
          required
          ikonKiri={<Lock size={16} />}
          error={state.fieldErrors?.kata_sandi}
          defaultValue=""
        />
        <div className="flex justify-end mt-2">
          <Link
            href="/lupa-kata-sandi"
            className="text-xs font-semibold transition-colors hover:underline"
            style={{ color: 'var(--color-gold-600)' }}
          >
            Lupa kata sandi?
          </Link>
        </div>
      </div>

      <Tombol
        type="submit"
        varian="primer"
        ukuran="besar"
        lebarPenuh
        sedangMemuat={pending}
        ikonKanan={!pending ? <ArrowRight size={16} /> : undefined}
        id="tombol-masuk"
      >
        {pending ? 'Sedang Masuk...' : 'Masuk'}
      </Tombol>
    </form>
  );
}
