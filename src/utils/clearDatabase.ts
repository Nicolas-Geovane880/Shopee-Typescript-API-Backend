import prisma from "./prismaInstance.js";

export const clearDatabase = async () => {
    await prisma.loginChallenge.deleteMany ();
    await prisma.refreshToken.deleteMany ();
    await prisma.user.deleteMany ();
}

