import { useState, useEffect, type FormEvent } from "react";
import {
  Flame,
  UtensilsCrossed,
  ShoppingBag,
  LogIn,
  Search,
  ChevronRight,
} from "lucide-react";
import { iniciarSesion, registrarUsuario } from "./services/auth.service";
import type { AuthResponse } from "./types/auth";
import { obtenerPlatos } from "./services/platos.service";
import type { Plato } from "./types/plato";
import PaginaCliente from "./pages/cliente";
import PaginaAdmin from "./pages/admin";
import PaginaCocina from "./pages/cocina";

const PLATOS_DESTACADOS = [1, 6, 7, 4];

function App() {
  const [loginAbierto, setLoginAbierto] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorRegistro, setErrorRegistro] = useState("");
  const [cargandoRegistro, setCargandoRegistro] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargandoLogin, setCargandoLogin] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [usuario, setUsuario] = useState<AuthResponse | null>(() => {
    const token = localStorage.getItem("access_token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!token || !usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado) as AuthResponse;
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("usuario");
      return null;
    }
  });
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [cargandoPlatos, setCargandoPlatos] = useState(true);
  const [errorPlatos, setErrorPlatos] = useState("");

  useEffect(() => {
    async function cargarPlatos() {
      try {
        setCargandoPlatos(true);
        setErrorPlatos("");

        const datos = await obtenerPlatos();
        setPlatos(datos);
      } catch (error) {
        console.error("Error al cargar los platos:", error);
        setErrorPlatos(
          "No pudimos cargar el catálogo. Inténtalo de nuevo más tarde.",
        );
      } finally {
        setCargandoPlatos(false);
      }
    }

    void cargarPlatos();
  }, []);

  const platosFiltrados = platos.filter(
    (plato) =>
      PLATOS_DESTACADOS.includes(plato.plato_id) &&
      plato.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const nombreRol = (rolId: number) => {
    const roles: Record<number, string> = {
      1: "Administrador",
      2: "Cocina",
      3: "Delivery",
      4: "Cliente",
    };

    return roles[rolId] ?? `Rol ${rolId}`;
  };

  function cerrarSesion() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setEmail("");
    setPassword("");
  }

  async function manejarLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorLogin("");
    setCargandoLogin(true);

    try {
      const datos = await iniciarSesion({ email, password });

      localStorage.setItem("access_token", datos.access_token);
      localStorage.setItem("usuario", JSON.stringify(datos));

      setUsuario(datos);
      setLoginAbierto(false);
      setPassword("");
    } catch {
      setErrorLogin(
        "No se pudo iniciar sesión. Comprueba tus credenciales e inténtalo de nuevo.",
      );
    } finally {
      setCargandoLogin(false);
    }
  }

  async function manejarRegistro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorRegistro("");
    setCargandoRegistro(true);

    try {
      const datos = await registrarUsuario({
        nombre_completo: nombreCompleto,
        email,
        password,
        telefono,
      });

      localStorage.setItem("access_token", datos.access_token);
      localStorage.setItem("usuario", JSON.stringify(datos));

      setUsuario(datos);
      setLoginAbierto(false);
      setModoRegistro(false);
      setNombreCompleto("");
      setTelefono("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrorRegistro(
        "No se pudo crear la cuenta. Comprueba los datos e inténtalo de nuevo.",
      );
    } finally {
      setCargandoRegistro(false);
    }
  }

  if (usuario?.rol_id === 1) {
    return (
      <PaginaAdmin
        nombre={usuario.nombre_completo}
        onCerrarSesion={cerrarSesion}
      />
    );
  }

  if (usuario?.rol_id === 2) {
    return (
      <PaginaCocina
        nombre={usuario.nombre_completo}
        onCerrarSesion={cerrarSesion}
      />
    );
  }

  if (usuario?.rol_id === 4) {
    return (
      <PaginaCliente
        nombre={usuario.nombre_completo}
        onCerrarSesion={cerrarSesion}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#171717] text-[#fff8ed]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#171717]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f04432]">
              <Flame size={27} />
            </span>
            <span>
              <span className="block text-lg font-black tracking-wide">
                RENGOKU
              </span>
              <span className="block text-xs text-[#f4b942]">
                SABOR QUE ENCIENDE
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a href="#inicio" className="transition hover:text-[#f4b942]">
              Inicio
            </a>
            <a href="#catalogo" className="transition hover:text-[#f4b942]">
              Catálogo
            </a>
            <a href="#nosotros" className="transition hover:text-[#f4b942]">
              Nuestra esencia
            </a>
          </div>

          <button
            onClick={() => setLoginAbierto(true)}
            className="flex items-center gap-2 rounded-xl bg-[#f04432] px-4 py-3 text-sm font-bold transition hover:bg-[#d93325]"
          >
            <LogIn size={18} />
            <span className="hidden sm:inline">Acceso de personal</span>
            <span className="sm:hidden">Entrar</span>
          </button>
        </nav>
      </header>
      {usuario && (
        <section className="border-b border-[#f4b942]/20 bg-[#242424] px-5 py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#f4b942]">
                Sesión autenticada
              </p>

              <h2 className="mt-1 text-lg font-bold">
                ¡Bienvenido, {usuario.nombre_completo}!
              </h2>

              <p className="mt-1 text-sm text-white/60">{usuario.email}</p>

              <span className="mt-2 inline-block rounded-full bg-[#f04432]/15 px-3 py-1 text-xs font-semibold text-[#ff796c]">
                {nombreRol(usuario.rol_id)}
              </span>
            </div>

            <button
              onClick={cerrarSesion}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold transition hover:border-[#f04432] hover:bg-[#f04432]/10"
            >
              Cerrar sesión
            </button>
          </div>
        </section>
      )}
      <main>
        <section
          id="inicio"
          className="relative overflow-hidden border-b border-white/10"
        >
          <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-[#f04432]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-[#f4b942]/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#f4b942]/30 bg-[#f4b942]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f4b942]">
                <Flame size={15} />
                El sabor de la llama
              </span>

              <h1 className="mt-7 max-w-xl text-5xl font-black leading-tight sm:text-6xl">
                SABOR QUE
                <span className="block text-[#f04432]">DESPIERTA</span>
                TU FUEGO.
              </h1>

              <p className="mt-6 max-w-lg leading-7 text-white/65">
                Descubre una experiencia gastronómica inspirada en la intensidad
                del fuego, la tradición japonesa y el placer de compartir una
                buena comida.
              </p>

              <a
                href="#catalogo"
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#f4b942] px-6 py-4 font-extrabold text-[#171717] transition hover:bg-[#ffd16c]"
              >
                Explorar catálogo
                <ChevronRight size={20} />
              </a>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/55">
                <span className="flex items-center gap-2">
                  <Flame size={17} className="text-[#f04432]" />
                  Inspiración japonesa
                </span>
                <span className="flex items-center gap-2">
                  <UtensilsCrossed size={17} className="text-[#f4b942]" />
                  Hecho para disfrutar
                </span>
              </div>
            </div>

            <div className="relative mx-auto flex min-h-80 w-full max-w-lg items-center justify-center">
              <div className="absolute h-64 w-64 rounded-full border border-[#f04432]/30" />
              <div className="absolute h-80 w-80 rounded-full border border-[#f4b942]/15" />
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-linear-to-br from-[#f4b942]/20 via-[#f04432]/20 to-transparent text-9xl shadow-2xl shadow-[#f04432]/10">
                🍜
              </div>
              <div className="absolute bottom-2 right-2 rounded-2xl border border-white/10 bg-[#242424] p-4 shadow-xl">
                <Flame className="mb-1 text-[#f04432]" size={23} />
                <p className="font-bold">Una experiencia única</p>
                <p className="mt-1 text-xs text-white/50">
                  Inspirada en el fuego
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="catalogo" className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f04432]">
                Nuestra selección
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Catálogo de sabores
              </h2>
              <p className="mt-3 text-white/55">
                Explora nuestros platos destacados.
              </p>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#242424] px-4 py-3 focus-within:border-[#f4b942]">
              <Search size={19} className="text-white/45" />
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar un plato..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/35 sm:w-52"
              />
            </label>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cargandoPlatos && (
              <p className="col-span-full py-10 text-center text-white/60">
                Encendiendo las llamas del catálogo...
              </p>
            )}

            {errorPlatos && (
              <p
                role="alert"
                className="col-span-full py-10 text-center text-red-400"
              >
                {errorPlatos}
              </p>
            )}
            {platosFiltrados.map((plato) => (
              <article
                key={plato.plato_id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#222222] transition hover:-translate-y-1 hover:border-[#f04432]/50"
              >
                <div className="h-48 overflow-hidden bg-linear-to-br from-[#3b2420] to-[#242424]">
                  {plato.imagen_url ? (
                    <img
                      src={plato.imagen_url}
                      alt={plato.nombre}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/40">
                      Imagen no disponible
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#f4b942]">
                    {plato.tipo}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">{plato.nombre}</h3>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {plato.descripcion ||
                      "Descubre este plato de nuestra selección."}
                  </p>

                  <div className="mt-5">
                    <button
                      onClick={() => setLoginAbierto(true)}
                      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold transition hover:bg-[#f04432]"
                    >
                      <ShoppingBag size={17} />
                      Ver pedido
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!cargandoPlatos && !errorPlatos && platosFiltrados.length === 0 && (
            <p className="mt-10 text-center text-white/50">
              No encontramos platos con ese nombre.
            </p>
          )}
        </section>

        <section
          id="nosotros"
          className="border-t border-white/10 bg-[#202020] px-5 py-12 text-center"
        >
          <Flame className="mx-auto text-[#f04432]" size={32} />
          <p className="mt-3 font-bold">RENGOKU · SABOR QUE ENCIENDE</p>
          <p className="mt-2 text-sm text-white/45">
            Una experiencia gastronómica con espíritu de fuego.
          </p>
        </section>
      </main>

      {loginAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setLoginAbierto(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-titulo"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#222222] p-6 shadow-2xl shadow-black/50 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Flame className="mb-3 text-[#f04432]" size={30} />
                <h2 id="login-titulo" className="text-2xl font-black">
                  {modoRegistro ? "Crear cuenta" : "Acceso de personal"}
                </h2>

                <p className="mt-2 text-sm text-white/55">
                  {modoRegistro
                    ? "Únete a RENGOKU y disfruta de nuestros sabores."
                    : "Inicia sesión para acceder a tu área de trabajo."}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <form
                onSubmit={modoRegistro ? manejarRegistro : manejarLogin}
                className="mt-6 space-y-4"
              >
                {modoRegistro && (
                  <>
                    <div>
                      <label
                        htmlFor="registro-nombre"
                        className="mb-2 block text-sm font-semibold text-white/80"
                      >
                        Nombre completo
                      </label>

                      <input
                        id="registro-nombre"
                        type="text"
                        autoComplete="name"
                        required
                        value={nombreCompleto}
                        onChange={(event) =>
                          setNombreCompleto(event.target.value)
                        }
                        placeholder="Tu nombre completo"
                        className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 outline-none transition focus:border-[#f4b942]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="registro-telefono"
                        className="mb-2 block text-sm font-semibold text-white/80"
                      >
                        Teléfono
                      </label>

                      <input
                        id="registro-telefono"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={telefono}
                        onChange={(event) => setTelefono(event.target.value)}
                        placeholder="Tu número de teléfono"
                        className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 outline-none transition focus:border-[#f4b942]"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-semibold text-white/80"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 outline-none transition focus:border-[#f4b942]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-semibold text-white/80"
                  >
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Introduce tu contraseña"
                    className="w-full rounded-xl border border-white/10 bg-[#171717] px-4 py-3 outline-none transition focus:border-[#f4b942]"
                  />
                </div>

                {(modoRegistro ? errorRegistro : errorLogin) && (
                  <p role="alert" className="text-sm text-red-400">
                    {modoRegistro ? errorRegistro : errorLogin}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={modoRegistro ? cargandoRegistro : cargandoLogin}
                  className="w-full rounded-xl bg-[#f04432] px-5 py-3 font-bold transition hover:bg-[#d93325] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {modoRegistro
                    ? cargandoRegistro
                      ? "Creando cuenta..."
                      : "Crear cuenta"
                    : cargandoLogin
                      ? "Iniciando sesión..."
                      : "Iniciar sesión"}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-white/60">
                {modoRegistro
                  ? "¿Ya tienes una cuenta?"
                  : "¿Todavía no tienes una cuenta?"}

                <button
                  type="button"
                  onClick={() => {
                    setModoRegistro(!modoRegistro);
                    setErrorLogin("");
                    setErrorRegistro("");
                  }}
                  className="ml-2 font-bold text-[#f4b942] transition hover:text-[#ffd16c]"
                >
                  {modoRegistro ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
