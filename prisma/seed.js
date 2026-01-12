const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Admin kullanıcısı ekleniyor...');
  const password = await hash('admin123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@menu.com' },
    update: { password }, // Şifreyi her seed'de güncelle (garanti olsun)
    create: {
      email: 'admin@menu.com',
      name: 'Süper Admin',
      password,
      role: 'ADMIN'
    },
  });
  console.log('✅ Admin oluşturuldu: admin@menu.com');
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });