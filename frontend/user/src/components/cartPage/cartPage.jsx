import { useState } from "react";
import { Button, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Coffee Beans - Espresso Arabica and Robusta Beans",
      price: 47.0,
      img: "/images/home/img1.png",
      stock: "In Stock",
      brand: "LavAzza",
      quantity: 1,
    },
    {
      id: 2,
      name: "Lavazza Coffee Blends - Try the Italian Espresso",
      price: 53.0,
      img: "/images/home/img1.png",
      stock: "In Stock",
      brand: "LavAzza",
      quantity: 2,
    },
    {
      id: 3,
      name: "Qualità Oro Mountain Grown - Espresso Coffee Beans",
      price: 38.65,
      img: "/images/home/img1.png",
      stock: "In Stock",
      brand: "LavAzza",
      quantity: 1,
    },
  ]);

  const handleDelete = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, delta) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <div className="pt-[100px]"></div>
      <div className="lg: p-3">
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg w-full">
          <h2 className="text-lg font-semibold">Giỏ hàng</h2>
          <p className="text-gray-500">{cartItems.length} items</p>

          <div className="mt-4 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col sm:flex-row items-center border-b py-4 sm:space-x-4 w-full gap-4 sm:items-center"
              >
                <Button
                  icon={<CloseOutlined />}
                  type="text"
                  danger
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2"
                />
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">
                    ${item.price.toFixed(2)} |{" "}
                    <span className="text-green-500">{item.stock}</span>
                  </p>
                  <div className="flex items-center space-x-4">
                    <Select
                      defaultValue={item.brand}
                      className="mt-1 w-full sm:w-auto"
                    >
                      <Select.Option value="LavAzza">LavAzza</Select.Option>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <Button onClick={() => handleQuantityChange(item.id, -1)}>
                        -
                      </Button>
                      <span className="text-lg font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button onClick={() => handleQuantityChange(item.id, 1)}>
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-lg sm:self-center">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button type="link">&larr; Continue Shopping</Button>
            <Button
              type="primary"
              className="bg-yellow-400 hover:bg-yellow-500"
            >
              All Check Out (${total.toFixed(2)})
            </Button>
          </div>
        </div>
      </div>
      <div className="pb-6"></div>
    </>
  );
};

export default CartPage;
