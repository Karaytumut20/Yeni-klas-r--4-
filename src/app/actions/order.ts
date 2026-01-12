'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

type CartItem = {
  id: string;
  quantity: number;
  price: number;
};

export async function createOrder(tableId: string, items: CartItem[], total: number, note?: string) {
  if (!tableId || items.length === 0) return { success: false, message: "Geçersiz sipariş" };

  try {
    await prisma.order.create({
      data: {
        tableId,
        total,
        note,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    revalidatePath('/admin'); // Admin paneli güncellensin
    return { success: true };
  } catch (error) {
    console.error("Sipariş hatası:", error);
    return { success: false, message: "Sipariş oluşturulamadı." };
  }
}