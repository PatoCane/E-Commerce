import { useState } from "react";
import Swal from "sweetalert2";

function FormularioProducto() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imagen: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.imagen) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://68100d8d27f2fdac24101f2d.mockapi.io/productos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Producto agregado",
          text: "El producto se agregó correctamente.",
        });
        setFormData({ name: "", price: "", imagen: "", description: "" });
      } else {
        throw new Error("Error al agregar producto");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center text-orange-600">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          type="text"
          placeholder="Nombre del producto"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          name="imagen"
          type="text"
          placeholder="URL de la imagen"
          value={formData.imagen}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}

export default FormularioProducto;