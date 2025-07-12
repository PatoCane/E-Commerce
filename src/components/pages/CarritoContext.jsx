import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const CarritoContext = createContext();

export const useCart = () => {
    return useContext(CarritoContext);
};

export const CarritoProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error al parsear cartItems desde localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // MODIFICADO: Ahora addItemToCart recibe el producto y la cantidad deseada
    const addItemToCart = (product, quantityToAdd = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            // Asegúrate de que el stock es un número
            const stockNumerico = parseInt(product.stock, 10); // Añadido radix 10 para buena práctica

            if (isNaN(stockNumerico) || stockNumerico < 0) {
                console.warn(`Producto ${product.nombre} (ID: ${product.id}) tiene stock inválido: ${product.stock}`);
                Swal.fire({
                    icon: 'warning',
                    title: 'Stock Inválido',
                    text: `El stock del producto "${product.nombre}" no es válido. No se puede agregar al carrito.`,
                    confirmButtonText: 'Entendido'
                });
                return prevItems;
            }

            if (existingItemIndex > -1) {
                const existingItem = prevItems[existingItemIndex];
                const newQuantityInCart = existingItem.cantidad + quantityToAdd;

                // Verifica si hay suficiente stock para añadir la cantidad deseada
                if (newQuantityInCart > stockNumerico) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Stock Insuficiente',
                        text: `Solo quedan ${stockNumerico} unidades de ${product.nombre}. Ya tienes ${existingItem.cantidad} en el carrito. No puedes agregar ${quantityToAdd} más.`,
                        confirmButtonText: 'Entendido'
                    });
                    return prevItems; // No actualiza el carrito si no hay stock
                }

                // Actualiza la cantidad del producto existente
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = { ...existingItem, cantidad: newQuantityInCart };
                return updatedItems;

            } else {
                // Verifica si hay stock para añadir la primera unidad (o la cantidad deseada)
                if (stockNumerico < quantityToAdd) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sin Stock Suficiente',
                        text: `El producto "${product.nombre}" solo tiene ${stockNumerico} unidades disponibles, y quieres agregar ${quantityToAdd}.`,
                        confirmButtonText: 'Entendido'
                    });
                    return prevItems; // No añade si no hay stock suficiente para la cantidad inicial
                }
                // Añade el nuevo producto con la cantidad especificada
                return [...prevItems, { ...product, cantidad: quantityToAdd }];
            }
        });
    };

    const removeItemFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateItemQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === productId) {
                    const stockNumerico = parseInt(item.stock, 10); // Añadido radix 10 para buena práctica
                    
                    if (isNaN(stockNumerico) || stockNumerico < 0) {
                        console.warn(`Producto ${item.nombre} (ID: ${item.id}) tiene stock inválido: ${item.stock}`); // Usar item.nombre
                        return item; // No actualiza si el stock es inválido
                    }

                    // Asegurarse de que la cantidad no sea menor que 1 y no exceda el stock
                    const quantityToSet = Math.max(1, Math.min(newQuantity, stockNumerico));
                    return { ...item, cantidad: quantityToSet };
                }
                return item;
            }).filter(item => item.cantidad > 0); // Esto elimina el ítem si su cantidad llega a 0
        });
    };

    const vaciarCarrito = () => {
        setCartItems([]);
    };

    const getCartTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.cantidad, 0);
    };

    // ✅ CORREGIDO: Calcula el total del carrito sumando el precio * cantidad de cada item, usando item.precio
    const getCartTotalAmount = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.precio || 0) * item.cantidad), 0).toFixed(2);
    };

    return (
        <CarritoContext.Provider value={{
            cartItems,
            addItemToCart,
            removeItemFromCart,
            updateItemQuantity,
            vaciarCarrito,
            getCartTotalQuantity,
            getCartTotalAmount
        }}>
            {children}
        </CarritoContext.Provider>
    );
};