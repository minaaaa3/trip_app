import { PrismaClient } from "@prisma/client";

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 既存のデータをすべて削除（必要に応じて）
  await prisma.spot.deleteMany();
  await prisma.trip.deleteMany();

  // 新しいデータを作成
  const trip = await prisma.trip.create({
    data: {
      title: "韓国旅行2025（サンプル）",
      // 関連するSpotも同時に作成する
      spots: {
        create: [
          {
            name: "景福宮",
            memo: "韓服を着て散策したい",
            url: "https://maps.app.goo.gl/abcdef123456",
          },
          {
            name: "明洞餃子",
            memo: "カルグクスも美味しいらしい",
            url: "https://maps.app.goo.gl/ghijkl789012",
          },
        ],
      },
    },
  });

  console.log(`Created trip with id: ${trip.id}`);
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // データベース接続を閉じる
    await prisma.$disconnect();
  });
