import { PrismaClient } from '@prisma/client';

// グローバルスコープにPrismaClientのインスタンスを保持するための変数を宣言
declare global {
  var prisma: PrismaClient | undefined;
}

// 開発環境ではホットリロードでファイルが再実行されるため、
// global.prismaが存在しない場合のみ新しいインスタンスを作成する
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;