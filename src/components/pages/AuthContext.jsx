import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función de login
  const login = async (email, password) => {
    try {
      const response = await fetch("https://68100d8d27f2fdac24101f2d.mockapi.io/Usuarios");
      const usuarios = await response.json();

      const usuarioEncontrado = usuarios.find((u) => u.email === email);

      if (!usuarioEncontrado) {
        throw new Error("Usuario no encontrado");
      }

      // ✅ CORREGIDO: Usar 'password' para la comparación, coincidiendo con MockAPI
      if (usuarioEncontrado.password !== password) {
        throw new Error("Contraseña incorrecta");
      }

      // Crear un objeto de usuario formateado, usando 'checkbox' para 'isAdmin'
      const usuarioFormateado = {
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        isAdmin: !!usuarioEncontrado.checkbox, // 'checkbox' es el campo booleano de MockAPI para admin
        // No almacenar la contraseña en el cliente por seguridad
      };

      setUser(usuarioFormateado);
      localStorage.setItem("usuario", JSON.stringify(usuarioFormateado));
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
  };

  // Mantener sesión iniciada al recargar
  useEffect(() => {
    const checkUser = () => {
      try {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
          const parsedUser = JSON.parse(usuarioGuardado);
          // ✅ Asegurarse que isAdmin se recalcule si parsedUser tiene checkbox
          parsedUser.isAdmin = !!parsedUser.checkbox;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error al parsear usuario de localStorage:", error);
        localStorage.removeItem("usuario");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
