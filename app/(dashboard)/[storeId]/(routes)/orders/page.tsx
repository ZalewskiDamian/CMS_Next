import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { BillboardColumn } from "./components/columns";
import { BillboardClient } from "./components/client";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: BillboardColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    adress: item.adress,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, sum) => {
      return total + Number(item.product.price)
    }, 0))
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
