import { type FC } from "react";

interface OrderItem {
  productId: number;
  productName: string;
  option1: string;
  option2: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  address: string;
  createdDate: string;
  orderItems: OrderItem[];
  total: number;
  username: string;
}

interface OrderProps {
  isLoading: boolean;
  orders: Order[];
}

const Order: FC<OrderProps> = ({ isLoading, orders }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-6 items-center gap-4 text-center font-bold">
        <p>Order ID</p>
        <p>Status</p>
        <p>Total</p>
        <p>Date</p>
        <p>Payment Method</p>
      </div>
      <ul className="space-y-5">
        {orders?.map((order) => (
          <li
            key={order.id}
            className="grid grid-cols-6 items-center gap-4 text-center"
          >
            <div>
              <p>{order.id}</p>
            </div>
            <div>
              <p>{order.paymentStatus}</p>
            </div>
            <div>
              <p>{order.total}</p>
            </div>
            <div>
              <p>{order.createdDate}</p>
            </div>
            <div>
              <p>{order.paymentMethod}</p>
            </div>
            <div>
              <button className="rounded bg-primary-500 px-4 py-2 text-white">
                Detail
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Order;
