import React, { useState } from 'react'; // ✅ CORREGIDO: Sintaxis de importación
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; 
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../pages/AuthContext";
import { useCart } from "../pages/CarritoContext"; 
import Swal from "sweetalert2";

const navbarlinks = [
  { id: 1, title: "Inicio", link: "/" },
  { id: 2, title: "Productos", link: "/store" },
  { id: 3, title: "Contacto", link: "/contacto" },
];

const navbarRedes = [
  { id: 1, title: "Instagram", link: "https://instagram.com", icon: "bi bi-instagram" },
  { id: 2, title: "TikTok", link: "https://tiktok.com", icon: "bi bi-tiktok" },
  { id: 3, title: "WhatsApp", link: "https://whatsapp.com", icon: "bi bi-whatsapp" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useAuth(); 
  const { getCartTotalQuantity, vaciarCarrito } = useCart(); 
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        vaciarCarrito();
        navigate("/login");
      }
    });
  };

  const totalCartItems = getCartTotalQuantity(); 

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-70 text-white z-50">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="w-12 h-auto" />
        </Link>

        {/* Botón para menú móvil */}
        <button className="md:hidden text-2xl" onClick={toggleMenu}>
          ☰
        </button>

        {/* Menú de escritorio */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navbarlinks.map((link) => (
            <li key={link.id}>
              <Link to={link.link} className="hover:text-sky-300">{link.title}</Link>
            </li>
          ))}

          {/* Enlace al Carrito */}
          <li>
            <Link to="/cart" className="relative hover:text-sky-300 text-xl">
              <i className="bi bi-cart"></i>
              {totalCartItems > 0 && ( 
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalCartItems} 
                </span>
              )}
            </Link>
          </li>

          {/* Sección de usuario (Login/Logout/Bienvenida) - ESCRITORIO */}
          {loading ? (
            <li key="desktop-loading-user" className="text-sm text-gray-400">Cargando usuario...</li>
          ) : user ? (
            <li key="desktop-logged-in-user" className="flex items-center space-x-2"> {/* Contenedor único con key */}
              <span className="text-sm">
                Hola, {String(user.email || "Usuario")} 
              </span>
              {user?.isAdmin && ( 
                <> {/* Fragmento para los enlaces de admin */}
                  <Link to="/admin-productos" className="text-orange-400 hover:text-orange-300 font-semibold"> 
                    Admin Productos
                  </Link>
                  <Link to="/admin/agregar-producto" className="text-orange-400 hover:text-orange-300 font-semibold"> 
                    Agregar
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-600 ml-4"
              >
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li key="desktop-logged-out-user" className="flex items-center space-x-2"> {/* Contenedor único con key */}
              <Link to="/login" className="hover:text-sky-300">Ingresar</Link>
              <Link to="/registrate" className="hover:text-sky-300">Registrate</Link>
            </li>
          )}

          {/* Enlaces a Redes Sociales */}
          {navbarRedes.map((red) => (
            <li key={red.id}>
              <a href={red.link} target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 text-xl">
                <i className={red.icon}></i>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Menú móvil (condicional) */}
      {isOpen && (
        <ul className="md:hidden flex flex-col items-center bg-black bg-opacity-90 py-4 space-y-2">
          {navbarlinks.map((link) => (
            <li key={link.id}>
              <Link to={link.link} onClick={() => setIsOpen(false)} className="hover:text-sky-300">
                {link.title}
              </Link>
            </li>
          ))}

          {/* Enlace al Carrito (móvil) */}
          <li>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="relative hover:text-sky-300 text-xl">
              <i className="bi bi-cart"></i>
              {totalCartItems > 0 && ( 
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalCartItems} 
                </span>
              )}
            </Link>
          </li>

          {/* Sección de usuario (móvil) */}
          {loading ? (
            <li key="mobile-loading-user" className="text-sm text-gray-400">Cargando usuario...</li>
          ) : user ? (
            <li key="mobile-logged-in-user"> {/* Contenedor único con key */}
              <span className="text-sm">
                Hola, {String(user.email || "Usuario")}
              </span>
              {user?.isAdmin && ( 
                <>
                  <Link to="/admin-productos" onClick={() => setIsOpen(false)} className="text-orange-400 hover:text-orange-300 font-semibold"> 
                    Admin Productos
                  </Link>
                  <Link to="/admin/agregar-producto" onClick={() => setIsOpen(false)} className="text-orange-400 hover:text-orange-300 font-semibold"> 
                    Agregar
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-400 hover:text-red-600"
              >
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li key="mobile-logged-out-user"> {/* Contenedor único con key */}
              <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-sky-300">
                Ingresar
              </Link>
              <Link to="/registrate" onClick={() => setIsOpen(false)} className="hover:text-sky-300">
                Registrate
              </Link>
            </li>
          )}

          {/* Enlaces a Redes Sociales (móvil) */}
          <li className="flex space-x-4 mt-4">
            {navbarRedes.map((red) => (
              <a
                key={red.id}
                href={red.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl hover:text-sky-300"
              >
                <i className={red.icon}></i>
              </a>
            ))}
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;