'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export async function createTable(formData: FormData) {
  const number = parseInt(formData.get("number") as string);

  if (!number) return;

  // 1. Önce masayı oluştur (ID almak için)
  const newTable = await prisma.table.create({
    data: {
      number: number,
      qrCode: "pending" // Geçici değer
    }
  });

  // 2. QR Kod İçeriğini Belirle
  // Gerçek hayatta burası domain.com/tr?tableId=... olacak
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const qrData = `${baseUrl}/tr?tableId=${newTable.id}`;

  // 3. QR Kodu Base64 Resim Olarak Üret
  try {
    const qrImage = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // 4. Masayı QR koduyla güncelle
    await prisma.table.update({
      where: { id: newTable.id },
      data: { qrCode: qrImage }
    });

  } catch (err) {
    console.error("QR Code Generation Error:", err);
  }

  revalidatePath('/admin/tables');
}

export async function deleteTable(id: string) {
  try {
    await prisma.table.delete({ where: { id } });
    revalidatePath('/admin/tables');
  } catch (error) {
    console.error("Masa silinemedi:", error);
  }
}