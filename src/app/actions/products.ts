'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createProduct(formData: FormData) {
  const name_tr = formData.get("name_tr") as string;
  const name_en = formData.get("name_en") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const desc_tr = formData.get("desc_tr") as string;
  const image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"; // Demo Resim

  if (!name_tr || !price || !categoryId) return;

  await prisma.product.create({
    data: {
      name_tr,
      name_en,
      price,
      categoryId,
      desc_tr,
      image
    }
  });

  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isAvailable: !currentStatus }
  });
  revalidatePath('/admin/products');
}