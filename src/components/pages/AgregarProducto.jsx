import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";

function AgregarProducto() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "", // ✅ CORREGIDO: Cambiado de imagenURL a imagen para que coincida con MockAPI
  });

  const API_URL_PRODUCTOS = import.meta.env.VITE_MOCKAPI_URL_PRODUCTOS || "https://68100d8d27f2fdac24101f2d.mockapi.io/productos";

  useEffect(() => {
    if (user === undefined) {
      setCheckingAuth(true);
      return;
    }

    if (user === null) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder.",
      });
      navigate("/login");
    } else if (!user?.isAdmin) {
      Swal.fire({
        icon: "error",
        title: "Acceso restringido",
        text: "Solo el administrador puede agregar productos.",
      });
      navigate("/");
    } else {
      setCheckingAuth(false);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { nombre, descripcion, precio, stock, imagen } = producto; // ✅ Usar 'imagen'

    if (!nombre || !descripcion || !precio || !stock || !imagen) { // ✅ Usar 'imagen'
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios.",
      });
      setIsSubmitting(false);
      return;
    }

    const parsedPrecio = parseFloat(precio);
    if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
      Swal.fire({ icon: "warning", title: "Precio inválido", text: "El precio debe ser un número positivo." });
      setIsSubmitting(false);
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      Swal.fire({ icon: "warning", title: "Stock inválido", text: "El stock debe ser un número entero no negativo." });
      setIsSubmitting(false);
      return;
    }
    
    if (!imagen.startsWith("http://") && !imagen.startsWith("https://")) { // ✅ Usar 'imagen'
        Swal.fire({ icon: "warning", title: "URL de imagen inválida", text: "La URL de la imagen debe comenzar con http:// o https://." });
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch(API_URL_PRODUCTOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: parsedPrecio,
          stock: parsedStock,
          imagen, // ✅ Enviar 'imagen' a la API
        }),
      });

      if (!response.ok) throw new Error("No se pudo guardar el producto");

      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: "El producto fue agregado exitosamente.",
      });

      setProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen: "", // ✅ Limpiar 'imagen'
      });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto. Intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingAuth) {
    return <p className="text-center mt-10">Verificando permisos...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-4 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={producto.nombre}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
          disabled={isSubmitting}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={producto.descripcion}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
          disabled={isSubmitting}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={producto.precio}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
          min="0.01"
          step="0.01"
          disabled={isSubmitting}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={producto.stock}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
          min="0"
          disabled={isSubmitting}
        />
        <input
          type="text"
          name="imagen" // ✅ CORREGIDO: 'name' debe ser 'imagen'
          placeholder="URL de la imagen"
          value={producto.imagen} // ✅ CORREGIDO: 'value' debe ser producto.imagen
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Agregando..." : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
}

export default AgregarProducto;
