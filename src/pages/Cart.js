import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Veuillez vous connecter pour accéder au panier</div>;
  }

  if (cartItems.length === 0) {
    return <div className="cart-empty">Votre panier est vide</div>;
  }

  const handlePurchase = () => {
    alert("Achat effectué avec succès!");
    clearCart();
  };

  return (
    <div className="cart">
      <h1>Mon Panier</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} />
            <div className="item-info">
              <h3>{item.title}</h3>
              <p>{item.price}€</p>
            </div>
            <div className="quantity-controls">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="btn btn-danger"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: {getCartTotal().toFixed(2)}€</h3>
        <div className="cart-actions">
          <button onClick={clearCart} className="btn btn-warning">
            Vider le panier
          </button>
          <button onClick={handlePurchase} className="btn btn-primary">
            Procéder à l'achat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
