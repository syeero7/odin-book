import prisma from "../src/lib/prisma-client";

const { GUEST_USERNAME } = process.env;

async function seedDatabase() {
  try {
    console.log("seeding...");

    const records = await prisma.user.count();
    if (records !== 0) {
      throw new Error("Data already exists, Seeding cancelled.");
    }

    await prisma.user.create({
      data: {
        username: GUEST_USERNAME!,
        avatarUrl: `https://api.dicebear.com/9.x/${"fun-emoji"}/svg?seed=${GUEST_USERNAME!
          .split("")
          .map((char) => char.charCodeAt(0))
          .join("")}&size=${200}&radius=50`,
      },
    });

    console.log("Database seeding has been completed successfully.");
  } catch (error) {
    console.error("Error during  database seeding: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
