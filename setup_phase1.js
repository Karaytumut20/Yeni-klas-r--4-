/**
 * QR MENU PRO - VERCEL BUILD FIX SCRIPT
 * Amaç: Vercel üzerinde Prisma Client hatasını çözmek için package.json scriptlerini günceller.
 * Çalıştırmak için: node setup_vercel.js
 */

const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(process.cwd(), "package.json");

function updatePackageJson() {
  try {
    // 1. Dosya var mı kontrol et
    if (!fs.existsSync(packageJsonPath)) {
      console.error(
        "❌ HATA: package.json dosyası bulunamadı! Lütfen ana dizinde olduğunuzdan emin olun."
      );
      process.exit(1);
    }

    console.log("📦 package.json okunuyor...");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // 2. Mevcut scriptleri yedekle ve güncelle
    console.log("⚙️  Scriptler güncelleniyor...");

    // Eski build komutunu korumaya gerek yok, Vercel için standart olanı yazıyoruz
    packageJson.scripts = {
      ...packageJson.scripts,
      postinstall: "prisma generate", // Bağımlılıklar yüklenince çalışır
      build: "prisma generate && next build", // Derleme sırasında çalışır
    };

    // 3. Dosyayı kaydet
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log("\n✅ İŞLEM BAŞARILI!");
    console.log("--------------------------------------------------");
    console.log('1. "package.json" dosyanız Vercel için yapılandırıldı.');
    console.log("2. Şimdi bu değişikliği Git'e gönderin:");
    console.log("   git add package.json");
    console.log('   git commit -m "Fix Vercel build scripts"');
    console.log("   git push");
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error("❌ BEKLENMEYEN HATA:", error.message);
  }
}

updatePackageJson();
