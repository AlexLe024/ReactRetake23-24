import React, { useState, useEffect } from 'react';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dev-su.eda1.ru/test_task/products.php');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      const productToAdd = products.find((p) => p.id === parseInt(selectedProduct));
      setOrder((prevOrder) => [
        ...prevOrder,
        { ...productToAdd, quantity: parseInt(quantity) },
      ]);
      setSelectedProduct('');
      setQuantity(1);
    } else {
      alert("Please select a product and enter a valid quantity.");
    }
  };

  const calculateTotal = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleSaveOrder = async () => {
    if (order.length === 0) {
      alert("Сначала добавьте товары в заказ.");
      return;
    }

    const orderToSave = order.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }));

    try {
      const response = await fetch('https://dev-su.eda1.ru/test_task/save.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: orderToSave }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Заказ успешно сохранён! Номер заказа: ${data.code}`);
        setOrder([]);
      } else {
        alert("Ошибка при сохранении заказа. Попробуйте еще раз.");
      }
    } catch (error) {
      console.error("Ошибка при сохранении заказа:", error);
      alert("Произошла ошибка. Попробуйте еще раз.");
    }
  };

  return (
    <div>
      <h2>Добавить товар</h2>
      <label>Выберите продукт:</label>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">--Выберите продукт--</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.title} — {product.price} руб.
          </option>
        ))}
      </select>
      <label>Количество:</label>
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button onClick={handleAddProduct}>Добавить</button>

      <div>
        <h3>Товары в заказе:</h3>
        <table>
          <thead>
            <tr>
              <th>Название товара</th>
              <th>Добавленное количество</th>
              <th>Стоимость добавленного количества</th>
            </tr>
          </thead>
          <tbody>
            {order.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toFixed(2)} руб.</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <strong>Итоговая стоимость:</strong> {calculateTotal()} руб.
        </div>
      </div>

      <button onClick={handleSaveOrder}>Сохранить</button>
    </div>
  );
};

export default OrderForm;