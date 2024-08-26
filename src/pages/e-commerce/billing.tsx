/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Breadcrumb, Table } from "flowbite-react";
import type { FC } from "react";
import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Datepicker } from "..";
import { useOrders } from "../../hooks/userOrders";
import { formatPriceAsVND } from "../../utils/util";

const EcommerceBillingPage: FC = function () {
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
            <Breadcrumb.Item>Billing</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Transactions
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-y-6 px-4">
        <Transactions transactions={data} />
      </div>
    </NavbarSidebarLayout>
  );
};

const Transactions: FC<any> = function ({ transactions }: any) {
  console.log(transactions);
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            List of latest transactions
          </h3>
        </div>
        <div className="shrink-0">
          <a
            href="#"
            className="rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
          >
            View all
          </a>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell>Transaction</Table.HeadCell>
                  <Table.HeadCell>Date &amp; Time</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="bg-white dark:bg-gray-800">
                  {transactions?.map((transaction: any) => {
                    return (
                      <Table.Row>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                          Payment from{" "}
                          <span className="font-semibold">
                            {transaction.username}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                          {transaction.updatedDate
                            ? transaction.updatedDate
                            : transaction.createdDate}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPriceAsVND(transaction.total)}
                        </Table.Cell>
                        <Table.Cell className="flex whitespace-nowrap p-4">
                          <Badge
                            color={
                              transaction.paymentStatus === "Paid"
                                ? "success"
                                : transaction.paymentStatus === "Pending"
                                ? "warning"
                                : "failure"
                            }
                          >
                            {transaction.paymentStatus}
                          </Badge>
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
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Transactions Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EcommerceBillingPage;
