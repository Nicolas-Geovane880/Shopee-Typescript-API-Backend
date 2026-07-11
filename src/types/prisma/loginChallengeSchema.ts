export type LoginChallenge = {
    expiresAt: Date;
    id: string;
    createdAt: Date;
    userId: number;
    codeHash: string;
    attempts: number;
    consumedAt: Date | null;
} | ({
    user: {
        id: number;
        name: string;
        email: string;
        passwordHash: string;
    };
} & {
    expiresAt: Date;
    id: string;
    createdAt: Date;
    userId: number;
    codeHash: string;
    attempts: number;
    consumedAt: Date | null;
});

