import { useState } from "react";

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, email, mensaje } = formData;

    if (!nombre || !email || !mensaje) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setError("");

    try {
      const response = await fetch("https://formspree.io/f/mjkvdrlv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      if (response.ok) {
        setEnviado(true);
        setFormData({ nombre: "", email: "", mensaje: "" });
      } else {
        setError("Hubo un error al enviar el mensaje.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">Contacto</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mensaje:</label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
              rows="5"
              className="w-full mt-1 p-2 border border-gray-300 rounded resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition duration-300"
          >
            Enviar
          </button>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {enviado && <p className="text-orange-600 mt-4">¡Mensaje enviado con éxito!</p>}
      </div>
    </div>
  );
}

export default Contacto;