import bcrypt from "bcryptjs";
import type { UserCreateSchema } from "../types/userSchema.js";
import prisma from "../utils/prismaInstance.js";

export const saveUser = async (dto: UserCreateSchema) => {
    const passwordHash = await bcrypt.hash (dto.password, 12);

    const saved = await prisma.user.create ({
        data: {
            name: dto.name,
            email: dto.email,
            passwordHash: passwordHash,
        },
    });

    return {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        createdAt: new Date (),
    }
}

export const findByEmail = (email: string) => {
    return prisma.user.findUnique ({
        where: {email: email},
    });
}

export const me = async (userId: number) => {
    return prisma.user.findUnique ({
        where: {id: userId},
    });
}