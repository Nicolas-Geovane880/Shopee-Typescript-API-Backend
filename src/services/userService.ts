import bcrypt from "bcryptjs";
import type { UserCreateSchema } from "../types/userSchema.js";
import prisma from "../utils/prismaInstance.js";
import { ConflictException } from "../exceptions/conflictException.js";
import { ErrorMessage } from "../constants/errorMessage.js";

export const save = async (dto: UserCreateSchema) => {
    const byEmail = await findByEmail (dto.email);

    if (byEmail) throw new ConflictException (409, ErrorMessage.EMAIL_ALREADY_USED);

    const passwordHash = await bcrypt.hash (dto.password, 12);

    const user = await prisma.user.create ({
        data: {
            name: dto.name,
            email: dto.email,
            passwordHash: passwordHash,
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
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