// src/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link para navegar

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Página No Encontrada</h2>
      <p className="text-lg text-gray-600 mb-8">
        Lo sentimos, la página que buscas no existe o se ha movido.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out"
      >
        Volver al Inicio
      </Link>
      {/* Opcional: Puedes añadir más enlaces útiles aquí */}
      {/* <Link 
        to="/store" 
        className="mt-4 text-blue-600 hover:underline"
      >
        Ir a la Tienda
      </Link> */}
    </div>
  );
}

export default NotFound;