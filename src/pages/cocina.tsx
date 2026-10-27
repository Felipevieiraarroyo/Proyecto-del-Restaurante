import {
  Flame,
  LogOut,
  ChefHat,
  ClipboardList,
  History,
  BarChart3,
} from "lucide-react";

interface CocinaProps {
  nombre: string;
  onCerrarSesion: () => void;
}

export default function PaginaCocina({ nombre, onCerrarSesion }: CocinaProps) {
  const secciones = [
    {
      titulo: "Pedidos pendientes",
      descripcion: "Consultar los pedidos que esperan preparación.",
      icono: ClipboardList,
    },
    {
      titulo: "Historial de cocina",
      descripcion: "Consultar el historial de pedidos procesados.",
      icono: History,
    },
    {
      titulo: "Estadísticas",
      descripcion: "Visualizar estadísticas de las operaciones de cocina.",
      icono: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#171717] text-[#fff8ed]">
      <header className="border-b border-white/10 bg-[#202020]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <div className="flex items-center gap-3">
            <Flame size={32} className="text-[#f04432]" />

            <div>
              <h1 className="text-xl font-black">RENGOKU</h1>
              <p className="text-xs text-[#f4b942]">ÁREA DE COCINA</p>
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
        <div className="flex items-center gap-3">
          <ChefHat size={34} className="text-[#f4b942]" />

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#f4b942]">
              Panel de cocina
            </p>

            <h2 className="mt-1 text-3xl font-black sm:text-4xl">
              ¡Hola, {nombre}!
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-2xl leading-7 text-white/60">
          Desde aquí podrás consultar los pedidos pendientes, revisar el
          historial y acceder a las estadísticas de cocina.
        </p>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secciones.map((seccion) => {
            const Icono = seccion.icono;

            return (
              <article
                key={seccion.titulo}
                className="rounded-2xl border border-white/10 bg-[#222222] p-6 transition hover:border-[#f4b942]/60"
              >
                <Icono size={30} className="text-[#f4b942]" />

                <h3 className="mt-5 text-lg font-bold">{seccion.titulo}</h3>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {seccion.descripcion}
                </p>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
