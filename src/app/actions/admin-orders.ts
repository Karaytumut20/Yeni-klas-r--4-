'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });
    revalidatePath('/admin/orders');
    revalidatePath('/admin'); // Dashboard'u da güncelle
  } catch (error) {
    console.error("Durum güncelleme hatası:", error);
  }
}

export async function deleteOrder(orderId: string) {
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath('/admin/orders');
}