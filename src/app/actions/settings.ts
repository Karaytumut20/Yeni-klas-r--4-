'use server';
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateProfile(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const targetEmail = "admin@menu.com";

  const data: any = { name };
  if (password && password.length >= 6) {
    data.password = await hash(password, 12);
  }

  try {
    await prisma.user.update({
      where: { email: targetEmail },
      data: data
    });
    revalidatePath('/admin/settings');
    return { success: true, message: "Profil güncellendi" };
  } catch (error) {
    return { success: false, message: "Güncelleme başarısız" };
  }
}