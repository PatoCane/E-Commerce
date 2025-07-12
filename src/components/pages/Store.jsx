import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCart } from "./CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Store() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { addItemToCart } = useCart();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_MOCKAPI_URL_PRODUCTOS || "https://68100d8d27f2fdac24101f2d.mockapi.io/productos";

  useEffect(() => {
    setIsLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setProducts)
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const verDetalleYAgregar = (producto) => {
    const stockDisponible = parseInt(producto.stock, 10) || 0;

    Swal.fire({
      title: producto.nombre, // ✅ Usar producto.nombre
      html: `
        <img src="${producto.imagen}" style="width:100%; max-width:300px; margin-bottom:10px;" 
             onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=No+Imagen';" />
        <p>${producto.description || ""}</p>
        <p><strong>Precio:</strong> $${parseFloat(producto.precio || 0).toFixed(2)}</p>
        <p><strong>Stock disponible:</strong> ${stockDisponible}</p>
        <label for="cantidad" class="mt-4 block text-lg font-medium">Cantidad:</label>
        <input id="cantidad" type="number" min="1" value="1" 
               max="${stockDisponible}"  
               class="swal2-input" style="width:100px;" />
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar al carrito",
      focusConfirm: false,
      preConfirm: () => {
        const valor = document.getElementById("cantidad").value;
        const cantidad = parseInt(valor, 10);

        if (isNaN(cantidad) || cantidad < 1) {
          Swal.showValidationMessage("Cantidad inválida. Debe ser al menos 1.");
          return false;
        }
        if (cantidad > stockDisponible) {
          Swal.showValidationMessage(`Solo hay ${stockDisponible} unidades disponibles de ${producto.nombre}.`);
          return false;
        }
        return cantidad;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const cantidadSeleccionada = result.value;

        if (!user) {
          Swal.fire({
            icon: "info",
            title: "Inicia sesión",
            text: "Debes iniciar sesión para comprar. Serás redirigido al login.",
          }).then(() => {
            navigate("/login");
          });
          return;
        }

        addItemToCart(producto, cantidadSeleccionada); 

        Swal.fire("Agregado", `${cantidadSeleccionada} unidad(es) de ${producto.nombre} agregadas al carrito`, "success");
      }
    });
  };

  return (
    <div className="px-5 max-w-[1200px] mx-auto p-20"> 
      {user?.isAdmin && (
        <div className="text-right mb-6">
          <Link
            to="/admin-productos" // ✅ Ruta consistente con App.jsx
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            Panel de Administración
          </Link>
        </div>
      )}

      {isLoading ? ( 
        <div className="text-center mt-10"> 
          <p className="text-lg text-gray-700">Cargando productos...</p> 
        </div> 
      ) : products.length === 0 ? ( 
        <div className="text-center mt-10"> 
          <p className="text-lg text-gray-700">No hay productos disponibles en este momento.</p> 
        </div> 
      ) : ( 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"> 
          {products.map((p) => ( 
            <div key={p.id} className="border border-gray-300 rounded-lg p-4 bg-gray-100 flex flex-col items-center"> 
              <img 
                src={p.imagen} // ✅ Usar p.imagen
                alt={p.nombre} // ✅ Usar p.nombre
                className="w-full h-[150px] object-cover rounded cursor-pointer" 
                onClick={() => verDetalleYAgregar(p)} 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150x150?text=No+Imagen"; }}
              /> 
              <h3 className="mt-2 mb-1 text-lg font-semibold text-center">{p.nombre}</h3>
              <p className="mb-2 font-bold text-gray-800">${parseFloat(p.precio || 0).toFixed(2)}</p>
              <p className="text-sm text-gray-600 mb-2">Stock: {parseInt(p.stock, 10) || 0}</p>
              <button 
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition" 
                onClick={() => verDetalleYAgregar(p)} 
              > 
                Ver detalle / Agregar 
              </button> 
            </div> 
          ))} 
        </div> 
      )} 
    </div> 
  );
}

export default Store;
