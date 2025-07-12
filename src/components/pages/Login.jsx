import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Sesión iniciada correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text:
          error.message === "Usuario no encontrado"
            ? "El usuario no existe."
            : error.message === "Contraseña incorrecta"
            ? "La contraseña es incorrecta."
            : "Ocurrió un error. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/95 shadow-[0_0_20px_orangered] rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;