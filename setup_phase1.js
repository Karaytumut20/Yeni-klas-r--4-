/**
 * QR MENU PRO - TYPE ERROR FIX SCRIPT
 * Amaç: NextAuth 'role' özelliği için eksik olan TypeScript tanımlarını eklemek.
 * Bu script 'src/types/next-auth.d.ts' dosyasını oluşturur.
 * Çalıştırmak için: node fix_types.js
 */

const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    const dirname = path.dirname(absolutePath);

    // Klasör yoksa oluştur
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(absolutePath, content.trim());
    console.log(`✅ Oluşturuldu: ${filePath}`);
  } catch (err) {
    console.error(`❌ Hata (${filePath}):`, err);
  }
}

const nextAuthTypesContent = `
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Session (Oturum) nesnesini genişletiyoruz
   */
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }

  /**
   * User (Kullanıcı) nesnesini genişletiyoruz
   */
  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT token nesnesini genişletiyoruz
   */
  interface JWT {
    role?: string
  }
}
`;

console.log("🚀 NextAuth Tip Tanımları Düzeltmesi Başlatılıyor...");
writeFile("src/types/next-auth.d.ts", nextAuthTypesContent);
console.log(
  "🎉 İşlem tamamlandı. Şimdi 'npm run build' komutunu tekrar çalıştırabilirsiniz."
);
