import React from 'react'; // Asegúrate de que esta sea la ÚNICA importación de React
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

// Componentes del directorio 'components/pages'
import { useAuth } from "./components/pages/AuthContext";
import Login from "./components/pages/Login";
import Registrate from "./components/pages/Registrate";
import Store from "./components/pages/Store";
import Cart from "./components/pages/Cart";
import AdminProductos from "./components/pages/AdminProductos";
import AgregarProducto from "./components/pages/AgregarProducto";
import EditarProducto from "./components/pages/EditarProducto";
import Contacto from "./components/pages/Contacto";
import Fondo from './components/assets/fondo.png'; // Asegúrate de que esta ruta sea correcta

// Otros componentes que están en la misma carpeta que App.jsx
import NotFound from './NotFound';
import Hero from './components/Hero/Hero';
import Navbar from './components/NavBar/Navbar';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Cargando datos de usuario...</p>;
  }

  if (!user || !user.isAdmin) {
    // Redirige a la página de inicio si no es administrador
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const bgImagen = {
    backgroundImage: `url(${Fondo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
    backgroundSize: "cover",
    position: "relative"
  };

  return (
    <ErrorBoundary>
      <Router>
        <Navbar />
        <div style={bgImagen} className="overflow-hidden min-h-screen pt-20 p-2 w-full">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrate" element={<Registrate />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contacto" element={<Contacto />} /> 
            
            {/* Rutas protegidas para ADMINISTRADORES */}
            <Route
              path="/admin-productos"
              element={
                <AdminRoute>
                  <AdminProductos />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/agregar-producto"
              element={
                <AdminRoute>
                  <AgregarProducto />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/editar-producto/:id"
              element={
                <AdminRoute>
                  <EditarProducto />
                </AdminRoute>
              }
            />

            {/* Ruta para cualquier otra URL no encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;