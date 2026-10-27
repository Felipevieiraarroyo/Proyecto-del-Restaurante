import { ShoppingBag, Flame, LogOut } from "lucide-react";

interface ClienteProps {
  nombre: string;
  onCerrarSesion: () => void;
}

export default function PaginaCliente({
  nombre,
  onCerrarSesion,
}: ClienteProps) {
  return (
    <div className="min-h-screen bg-[#171717] text-[#fff8ed]">
      <header className="border-b border-white/10 bg-[#202020]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <div className="flex items-center gap-3">
            <Flame size={32} className="text-[#f04432]" />
            <div>
              <h1 className="text-xl font-black">RENGOKU</h1>
              <p className="text-xs text-[#f4b942]">ÁREA DEL CLIENTE</p>
            </div>
          </div>

          <button
            onClick={onCerrarSesion}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:border-[#f04432]"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-[#f4b942]">
          Bienvenido
        </p>

        <h2 className="mt-3 text-3xl font-black sm:text-4xl">
          ¡Hola, {nombre}!
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-white/60">
          Este es tu espacio en RENGOKU. Aquí podrás consultar las opciones
          disponibles para clientes.
        </p>

        <section className="mt-10 rounded-2xl border border-white/10 bg-[#222222] p-6 sm:p-8">
          <ShoppingBag size={32} className="text-[#f4b942]" />

          <h3 className="mt-4 text-xl font-bold">Tu espacio de cliente</h3>

          <p className="mt-2 text-sm leading-6 text-white/60">
            Estamos preparando esta sección para que puedas acceder a las
            funcionalidades disponibles para tu rol.
          </p>
        </section>
      </main>
    </div>
  );
}
