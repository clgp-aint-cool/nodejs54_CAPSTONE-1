import { prisma } from '../src/common/prisma/prisma-client.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password for demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Create demo user
  const demoUser = await prisma.nguoi_dung.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      mat_khau: hashedPassword,
      ho_ten: 'Demo User',
      tuoi: 25,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create sample images (placeholder URLs)
  const sampleImages = [
    {
      ten_hinh: 'Beautiful Mountain',
      duong_dan: 'https://picsum.photos/seed/mountain/800/600',
      mo_ta: 'A stunning mountain landscape',
    },
    {
      ten_hinh: 'Ocean Sunset',
      duong_dan: 'https://picsum.photos/seed/ocean/800/600',
      mo_ta: 'Peaceful ocean sunset',
    },
    {
      ten_hinh: 'City Lights',
      duong_dan: 'https://picsum.photos/seed/city/800/600',
      mo_ta: 'Vibrant city nightscape',
    },
    {
      ten_hinh: 'Forest Path',
      duong_dan: 'https://picsum.photos/seed/forest/800/600',
      mo_ta: 'Mystical forest trail',
    },
    {
      ten_hinh: 'Desert Dunes',
      duong_dan: 'https://picsum.photos/seed/desert/800/600',
      mo_ta: 'Golden desert sand dunes',
    },
  ];

  const createdImages = [];
  for (const img of sampleImages) {
    const image = await prisma.hinh_anh.create({
      data: {
        ...img,
        nguoi_dung_id: demoUser.nguoi_dung_id,
      },
    });
    createdImages.push(image);
  }

  console.log(`✅ Created ${createdImages.length} sample images`);

  // Add a few sample comments
  const comments = [
    { noi_dung: 'Amazing photo!' },
    { noi_dung: 'Love the colors!' },
    { noi_dung: 'Where was this taken?' },
  ];

  for (let i = 0; i < Math.min(3, createdImages.length); i++) {
    await prisma.binh_luan.create({
      data: {
        nguoi_dung_id: demoUser.nguoi_dung_id,
        hinh_id: createdImages[i].hinh_id,
        noi_dung: comments[i].noi_dung,
      },
    });
  }

  console.log('✅ Created sample comments');

  // Save one image
  await prisma.luu_anh.create({
    data: {
      nguoi_dung_id: demoUser.nguoi_dung_id,
      hinh_id: createdImages[0].hinh_id,
    },
  });

  console.log('✅ Created sample saved image');

  console.log('🎉 Seed completed!');
  console.log('\n📝 Demo credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
