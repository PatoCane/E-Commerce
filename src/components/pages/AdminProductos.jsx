import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";
import Fondo from '../assets/fondo.png'; // ✅ Importar la imagen de fondo

function AdminProductos() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const API_URL_PRODUCTOS = import.meta.env.VITE_MOCKAPI_URL_PRODUCTOS || "https://68100d8d27f2fdac24101f2d.mockapi.io/productos";

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder a esta página.",
      });
      navigate("/login");
    } else if (!user.isAdmin) {
      Swal.fire({
        icon: "error",
        title: "Acceso restringido",
        text: "Solo el administrador puede acceder a esta página.",
      });
      navigate("/");
    } else {
      fetchProductos();
    }
  }, [user, navigate, authLoading]);

  const fetchProductos = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(API_URL_PRODUCTOS);
      if (!response.ok) throw new Error("Error al cargar productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los productos.",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto definitivamente. ¡No se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${API_URL_PRODUCTOS}/${id}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) throw new Error("Error al eliminar");
          Swal.fire("Eliminado!", "El producto ha sido eliminado.", "success");
          fetchProductos(); // Volver a cargar los productos después de eliminar
        } catch (error) {
          console.error("Error al eliminar producto:", error);
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  // Estilos para el fondo
  const bgImagenStyle = {
    backgroundImage: `url(${Fondo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center", // Puedes ajustar esto a 'top', 'bottom', etc.
    backgroundSize: "cover",
    minHeight: "calc(100vh - 80px)", // Ajusta la altura para que ocupe la pantalla menos el navbar
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // Alinea el contenido arriba
    paddingTop: "20px" // Espacio desde el borde superior del fondo
  };

  if (authLoading) {
    return <p className="text-center mt-10">Verificando permisos de administrador...</p>;
  }

  if (loadingProducts) {
    return <p className="text-center mt-10">Cargando productos para administración...</p>;
  }

  if (productos.length === 0) {
    return (
      <div style={bgImagenStyle} className="text-center p-6"> {/* Aplica el estilo de fondo aquí */}
        <p className="text-lg text-gray-700 bg-white bg-opacity-80 p-4 rounded-lg shadow">
          No hay productos para administrar en este momento.{" "}
          <Link to="/admin/agregar-producto" className="text-blue-600 underline hover:text-blue-800">
            Agrega uno aquí
          </Link>
        </p>
      </div>
    );
  }

  return (
    // ✅ Aplica el estilo de fondo al div principal
    <div style={bgImagenStyle} className="max-w-5xl mx-auto p-6 pt-20"> 
      <h2 className="text-3xl font-bold text-center mb-6 text-orange-600 bg-white bg-opacity-80 p-3 rounded-lg shadow"> {/* Fondo para el título */}
        Panel de Administración de Productos
      </h2>

      <div className="mb-6 text-right">
        <Link
          to="/admin/agregar-producto"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          Agregar Producto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow bg-white bg-opacity-90 p-4"> {/* Fondo para la tabla */}
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border border-gray-300">Nombre</th>
              <th className="p-3 border border-gray-300">Precio</th>
              <th className="p-3 border border-gray-300">Stock</th>
              <th className="p-3 border border-gray-300">Imagen</th>
              <th className="p-3 border border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-100">
                <td className="p-3 border border-gray-300">{producto.nombre}</td>
                <td className="p-3 border border-gray-300">
                  ${parseFloat(producto.precio || 0).toFixed(2)}
                </td>
                <td className="p-3 border border-gray-300">
                  {parseInt(producto.stock, 10) || 0}
                </td>
                <td className="p-3 border border-gray-300">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/64?text=No+Imagen"; }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                      No img
                    </div>
                  )}
                </td>
                <td className="p-3 border border-gray-300 space-x-2">
                  <Link
                    to={`/admin/editar-producto/${producto.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductos;
