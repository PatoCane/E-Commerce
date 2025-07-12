import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";

function Registrate() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    isAdmin: false, // Por defecto, cualquier registro es un usuario normal
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { nombre, apellido, email, password, isAdmin } = formData;

    // Validación simple
    if (!nombre || !apellido || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Crear usuario en MockAPI
      const res = await fetch("https://68100d8d27f2fdac24101f2d.mockapi.io/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ✅ CORREGIDO: Enviar 'checkbox' para 'isAdmin' a MockAPI
        body: JSON.stringify({ nombre, apellido, email, password, checkbox: isAdmin }),
      });

      if (!res.ok) throw new Error("Error al registrar usuario");

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Ya puedes iniciar sesión.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Login automático
      await login(email, password);
      navigate("/");

    } catch (error) {
      console.error("Error al registrar:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el usuario. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white/95 shadow-[0_0_20px_orangered] rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrarse</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
            disabled={isLoading}
          />
          <input
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrate"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registrate;