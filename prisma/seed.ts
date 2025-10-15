import { PrismaClient } from "@prisma/client";

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 既存のデータをすべて削除（リセットしたい場合に便利です）
  // 関連(Spot)から先に削除する必要があります
  await prisma.spot.deleteMany();
  await prisma.trip.deleteMany();

  // --- サンプルデータ1: 韓国旅行 ---
  const trip1 = await prisma.trip.create({
    data: {
      title: "韓国旅行2025（サンプル）",
      // 関連するSpotも同時に作成する
      spots: {
        create: [
          {
            name: "景福宮（キョンボックン）",
            memo: "韓服を着て散策したい。入場料が無料になるらしい。",
            url: "https://maps.app.goo.gl/h2a5q1m8v7z6p3c29",
          },
          {
            name: "明洞餃子",
            memo: "カルグクスも美味しいらしい。キムチはおかわり自由。",
            url: "https://maps.app.goo.gl/fE8b9rY3o2t1k5D48",
          },
          {
            name: "広蔵市場（クァンジャンシジャン）",
            memo: "ユッケとピンデトッが有名。活気があって楽しい。",
            url: "https://maps.app.goo.gl/n7s3j9k2L4xG6P7B6",
          },
        ],
      },
    },
  });
  console.log(`Created trip with id: ${trip1.id}`);

  // --- サンプルデータ2: 沖縄旅行 ---
  const trip2 = await prisma.trip.create({
    data: {
      title: "沖縄 家族旅行",
      spots: {
        create: [
          {
            name: "沖縄美ら海水族館",
            memo: "ジンベエザメの迫力がすごい。黒潮探検（水上観覧コース）も忘れずに。",
            url: "https://maps.app.goo.gl/sD6P5fX8y7Z2A1B99",
          },
          {
            name: "国際通り",
            memo: "お土産探しと食べ歩き。夜まで賑やか。",
            url: "https://maps.app.goo.gl/k9R8tY5u6v3X4c2a7",
          },
          {
            name: "古宇利島",
            memo: "ハートロックが有名。海の透明度が高いのでドライブに最適。",
            url: "https://maps.app.goo.gl/w5H7jT4F3b1v9c8E9",
          },
        ],
      },
    },
  });
  console.log(`Created trip with id: ${trip2.id}`);

  // --- サンプルデータ3: 京都旅行 ---
  const trip3 = await prisma.trip.create({
    data: {
      title: "京都 紅葉狩りの旅",
      spots: {
        create: [
          {
            name: "清水寺",
            memo: "清水の舞台からの眺めが絶景。夜のライトアップも見てみたい。",
            url: "https://maps.app.goo.gl/xZ9fA7b6c5P4d3E1A",
          },
          {
            name: "嵐山 竹林の道",
            memo: "朝早い時間に行くと人が少なくて幻想的。",
            url: "https://maps.app.goo.gl/mY6tB5c4d3E2f1A98",
          },
        ],
      },
    },
  });
  console.log(`Created trip with id: ${trip3.id}`);

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
