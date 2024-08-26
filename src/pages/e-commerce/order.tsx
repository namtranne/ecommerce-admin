/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Breadcrumb, Table } from "flowbite-react";
import type { FC } from "react";
import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Datepicker } from "..";
import { useOrders } from "../../hooks/userOrders";
import { formatPriceAsVND } from "../../utils/util";

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
  console.log(orders);
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
                        <Table.Cell className="whitespace-nowrap p-4 text-sm dark:text-white text-blue-500 font-semibold">
                          {order.paymentMethod}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPriceAsVND(order.total)}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
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
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4">
                          <div className="flex">
                            <OrderBadge order={order} />
                          </div>
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
