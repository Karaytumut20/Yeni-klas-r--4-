'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createCategory(formData: FormData) {
  const name_tr = formData.get("name_tr") as string;
  const name_en = formData.get("name_en") as string;

  if (!name_tr || !name_en) return;

  await prisma.category.create({
    data: { name_tr, name_en }
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
  } catch (error) {
    console.error("Kategori silinemedi:", error);
  }
}