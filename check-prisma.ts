import prisma from "./lib/prisma";

async function main() {
  try {
    console.log("Checking Spot model include options...");
    // @ts-ignore
    const dmmf = (prisma as any)._dmmf;
    const spotModel = dmmf.datamodel.models.find((m: any) => m.name === "Spot");
    console.log("Spot fields:", spotModel.fields.map((f: any) => f.name));
  } catch (e) {
    console.error(e);
  } finally {
    await (prisma as any).$disconnect();
  }
}

main();
