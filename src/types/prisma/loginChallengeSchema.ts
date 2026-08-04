export type LoginChallenge = ({
    user: {
        name: string;
        email: string;
        id: number;
        password_hash: string;
    };
} & {
    id: string;
    code_hash: string;
    expires_at: Date;
    attempts: number;
    consumed_at: Date | null;
    created_at: Date;
    user_id: number;
}) | null

