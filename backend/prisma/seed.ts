import prisma from "../src/lib/prisma-client";

const { GUEST_USERNAME } = process.env;
const SECOND_USERNAME = "#PixelX0";

async function seedDatabase() {
  try {
    console.log("seeding...");

    const records = await prisma.user.count();
    if (records !== 0) {
      throw new Error("Data already exists, Seeding cancelled.");
    }

    await prisma.$transaction([
      prisma.user.createMany({
        data: [
          {
            username: GUEST_USERNAME!,
            avatarUrl: `https://api.dicebear.com/9.x/${"fun-emoji"}/svg?seed=${GUEST_USERNAME!
              .split("")
              .map((char) => char.charCodeAt(0))
              .join("")}&size=${200}&radius=50`,
          },
          {
            username: SECOND_USERNAME,
            avatarUrl: `https://api.dicebear.com/9.x/${"fun-emoji"}/svg?seed=${SECOND_USERNAME
              .split("")
              .map((char) => char.charCodeAt(0))
              .join("")}&size=${200}&radius=50`,
          },
        ],
      }),
      prisma.user.update({
        where: {
          username: GUEST_USERNAME!,
        },
        data: {
          following: {
            connect: {
              username: SECOND_USERNAME,
            },
          },
          followers: {
            connect: {
              username: SECOND_USERNAME,
            },
          },
        },
      }),
      prisma.post.create({
        data: {
          title: "Exploring the Universe Through Data",
          content:
            "Astronomy and astrophysics are increasingly reliant on vast datasets generated by telescopes and space probes. Analyzing this data allows scientists to uncover secrets of distant galaxies, understand the birth of stars, and even search for exoplanets that could harbor life. The sheer volume and complexity of astronomical data present unique challenges and opportunities for data scientists. What celestial mysteries are you most eager to see solved with data?",
          author: {
            connect: { username: GUEST_USERNAME! },
          },
          likes: {
            create: {
              user: {
                connect: {
                  username: SECOND_USERNAME,
                },
              },
            },
          },
          comments: {
            create: {
              content:
                "I'm fascinated by how machine learning can help classify galaxies and identify new cosmic phenomena.",
              user: {
                connect: {
                  username: SECOND_USERNAME,
                },
              },
            },
          },
        },
      }),
      prisma.post.create({
        data: {
          title: "Decoding the Human Brain: Advances in Neuroscience",
          content:
            "The human brain remains one of the most complex and mysterious organs. Recent breakthroughs in neuroscience, fueled by advanced imaging techniques and computational models, are slowly unraveling its intricate workings. Understanding how memories are formed, emotions are processed, and consciousness arises has profound implications for treating neurological disorders and advancing artificial intelligence. What aspect of the brain do you find most intriguing?",
          author: {
            connect: {
              username: SECOND_USERNAME,
            },
          },
          likes: {
            create: {
              user: {
                connect: {
                  username: GUEST_USERNAME!,
                },
              },
            },
          },
          comments: {
            create: {
              content:
                "The concept of neuroplasticity and the brain's ability to rewire itself is absolutely incredible.",
              user: {
                connect: {
                  username: GUEST_USERNAME!,
                },
              },
            },
          },
        },
      }),
    ]);

    console.log("Database seeding has been completed successfully.");
  } catch (error) {
    console.error("Error during  database seeding: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
