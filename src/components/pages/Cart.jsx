import React, { useEffect } from 'react'; // Importamos useEffect
import { useCart } from './CarritoContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Cart() {
    const { cartItems, removeItemFromCart, updateItemQuantity, vaciarCarrito, getCartTotalAmount, getCartTotalQuantity } = useCart();
    const navigate = useNavigate();

    // ✅ NUEVO: Añadir console.log para depuración
    useEffect(() => {
        console.log("Cart Items:", cartItems);
        console.log("Total Quantity from getCartTotalQuantity():", getCartTotalQuantity());
    }, [cartItems, getCartTotalQuantity]); // Se ejecuta cada vez que cartItems o getCartTotalQuantity cambian

    const handleRemoveItem = (itemId) => {
        Swal.fire({
            title: '¿Eliminar producto?',
            text: 'Esta acción eliminará el producto del carrito.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                removeItemFromCart(itemId);
                Swal.fire('Eliminado!', 'El producto ha sido eliminado del carrito.', 'success');
            }
        });
    };

    const handleVaciarCarrito = () => {
        Swal.fire({
            title: '¿Vaciar carrito?',
            text: 'Se eliminarán todos los productos de tu carrito.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
                Swal.fire('Carrito vaciado!', 'Todos los productos han sido eliminados.', 'success');
            }
        });
    };

    const handleFinalizarCompra = async () => {
        if (cartItems.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Carrito vacío',
                text: 'No hay productos en el carrito para finalizar la compra.',
                confirmButtonText: 'Ir a la tienda'
            }).then(() => {
                navigate('/store');
            });
            return;
        }

        const { value: metodoPago } = await Swal.fire({
            title: "Selecciona un medio de pago",
            input: "select",
            inputOptions: {
                efectivo: "Efectivo",
                mercadopago: "MercadoPago",
                transferencia: "Transferencia bancaria",
            },
            inputPlaceholder: "Selecciona una opción",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (!value) {
                    return "Debes seleccionar un medio de pago";
                }
            },
        });

        if (metodoPago) {
            vaciarCarrito();
            Swal.fire({
                icon: 'success',
                title: '¡Compra Finalizada!',
                html: `Tu compra ha sido procesada con éxito usando <strong>${metodoPago}</strong>.<br>¡Gracias por tu pedido!`,
                confirmButtonText: 'Volver a la tienda'
            }).then(() => {
                navigate('/store');
            });
        }
    };

    const totalItemsInCart = getCartTotalQuantity(); 

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-gray-100 py-10 pt-20">
                <h2 className="text-3xl font-bold text-orange-600 mb-4">Carrito (0 productos)</h2>
                <p className="text-gray-700 text-lg">Tu carrito está vacío.</p>
                <Link to="/store" className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Ir a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 pt-20">
            <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
                    Carrito ({totalItemsInCart} {totalItemsInCart === 1 ? 'producto' : 'productos'})
                </h2>

                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
                            <img
                                src={item.imagen}
                                alt={item.nombre}
                                className="w-20 h-20 object-cover rounded mr-4"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=No+Imagen"; }}
                            />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-lg">{item.nombre}</h3>
                                <p className="text-gray-700">${parseFloat(item.precio || 0).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => updateItemQuantity(item.id, item.cantidad - 1)}
                                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
                                    disabled={item.cantidad <= 1}
                                >
                                    -
                                </button>
                                <span className="font-semibold">{item.cantidad}</span>
                                <button
                                    onClick={() => updateItemQuantity(item.id, item.cantidad + 1)}
                                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
                                    disabled={parseInt(item.stock) <= item.cantidad}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="ml-4 p-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-right text-2xl font-bold mt-6 text-gray-800">
                    Total: ${getCartTotalAmount()}
                </div>

                <div className="flex justify-between mt-8 space-x-4">
                    <button
                        onClick={handleVaciarCarrito}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex-1"
                    >
                        Vaciar Carrito
                    </button>
                    <button
                        onClick={handleFinalizarCompra}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex-1"
                    >
                        Finalizar compra
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;