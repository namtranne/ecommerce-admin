/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Breadcrumb, Select, Table } from "flowbite-react";
import { useState, type FC } from "react";
import { HiHome, HiPencilAlt } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Datepicker } from "..";
import { useOrders } from "../../hooks/userOrders";
import { formatPriceAsVND } from "../../utils/util";
import authAxios from "../../utils/axios";
import { toast } from "react-toastify";
import { QueryClient, useQueryClient } from "react-query";

function OrderBadge({ order }: any) {
  // Determine the color based on paymentStatus
  let badgeColor;
  switch (order.orderStatus) {
    case "Delivered":
      badgeColor = "success";
      break;
    case "Canceled":
      badgeColor = "failure";
      break;
    case "Waiting for Payment":
      badgeColor = "warning";
      break;
    case "Shipping":
      badgeColor = "indigo";
      break;
    default:
      badgeColor = "info";
      break;
  }

  return (
    <Badge className="p-2" color={badgeColor}>
      {order.orderStatus}
    </Badge>
  );
}

const OrderPage: FC = function () {
  const { data, isLoading } = useOrders();

  return (
    <NavbarSidebarLayout>
      <div className="mb-6 grid grid-cols-1 gap-y-6 px-4 pt-6 dark:border-gray-700 dark:bg-gray-900 xl:grid-cols-2 xl:gap-4">
        <div className="col-span-full">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="#">
              <div className="flex items-center gap-x-3">
                <HiHome className="text-xl" />
                <span className="dark:text-white">Home</span>
              </div>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/e-commerce/products">
              E-commerce
            </Breadcrumb.Item>
            <Breadcrumb.Item>Orders</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Latest Orders
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-y-6 px-4">
        <Orders orders={data} />
      </div>
    </NavbarSidebarLayout>
  );
};

const Orders: FC<any> = function ({ orders }: any) {
  const [orderId, setOrderId] = useState(null);
  const queryClient = useQueryClient();
  const orderStatuses = [
    { value: "Waiting for Payment", label: "Waiting for Payment" },
    { value: "Paid", label: "Paid" },
    { value: "Preparing", label: "Preparing" },
    { value: "Shipping", label: "Shipping" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
  ];
  const paymentStatuses = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // const
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);

  const handleChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };

  const handleEditOrder = async (order: any) => {
    if (
      order.orderStatus === selectedStatus &&
      order.paymentStatus === selectedPaymentStatus
    ) {
      setSelectedPaymentStatus(null);
      setSelectedStatus(null);
      setOrderId(null);
      return;
    }
    try {
      console.log(selectedPaymentStatus, order);
      const res = await authAxios.patch("/admin/order", {
        ...order,
        orderStatus: selectedStatus ? selectedStatus : order.orderStatus,
        paymentStatus: selectedPaymentStatus
          ? selectedPaymentStatus
          : order.paymentStatuses,
      });
      toast.success(res.data.message);
      queryClient.invalidateQueries(["orders"]);
    } catch (error: any) {
      toast.error(error.data.message);
    }
    setSelectedStatus(null);
    setSelectedPaymentStatus(null);
    setOrderId(null);
  };

  // console.log(orders);
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 ">
      <div className="mb-4 flex items-center justify-between"></div>
      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell>Order id</Table.HeadCell>
                  <Table.HeadCell>User</Table.HeadCell>
                  <Table.HeadCell>Date &amp; Time</Table.HeadCell>
                  <Table.HeadCell>Address</Table.HeadCell>
                  <Table.HeadCell>Payment method</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Payment Status</Table.HeadCell>
                  <Table.HeadCell>Order Status</Table.HeadCell>
                  <Table.HeadCell>Edit order status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="bg-white dark:bg-gray-800">
                  {orders?.map((order: any) => {
                    return (
                      <Table.Row>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                          {order.id}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {order.username}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                          {order.updatedDate
                            ? order.updatedDate
                            : order.createdDate}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                          <div className="w-40 overflow-scroll">
                            {order.address}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm dark:text-white text-blue-500 font-semibold">
                          {order.paymentMethod}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPriceAsVND(order.total)}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          {orderId !== order.id ? (
                            <div className="flex">
                              <Badge
                                className="p-2"
                                color={
                                  order.paymentStatus === "Paid"
                                    ? "success"
                                    : order.paymentStatus === "Pending"
                                    ? "warning"
                                    : "failure"
                                }
                              >
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          ) : (
                            <select
                              className="block py-2.5 px-0 w-40 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                              value={selectedPaymentStatus || ""}
                              onChange={(e: any) => {
                                setSelectedPaymentStatus(e.target.value);
                              }}
                            >
                              {paymentStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4">
                          {orderId !== order.id ? (
                            <div className="flex">
                              <OrderBadge order={order} />
                            </div>
                          ) : (
                            <select
                              className="block py-2.5 px-0 w-40 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                              value={selectedStatus || ""}
                              onChange={handleChange}
                            >
                              {orderStatuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-center">
                          {orderId !== order.id ? (
                            <button
                              className="flex"
                              onClick={() => {
                                setOrderId(order.id);
                                setSelectedStatus(order.orderStatus);
                                setSelectedPaymentStatus(order.paymentStatus);
                              }}
                            >
                              <HiPencilAlt className="text-xl" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                              onClick={() => handleEditOrder(order)}
                            >
                              Save
                            </button>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 sm:pt-6">
        <Datepicker />
      </div>
    </div>
  );
};

export default OrderPage;
