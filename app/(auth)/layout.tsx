// Layout untuk halaman autentikasi (/login, /register)
// Tidak menggunakan Navbar dan Footer global
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
