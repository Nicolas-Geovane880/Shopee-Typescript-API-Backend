import { describe, expect, it, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../utils/prismaInstance.js";
import { clearDatabase } from "../utils/clearDatabase.js";

const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

describe ("signup", () => {
    beforeEach (async () => {
        await clearDatabase ();
    })

    afterAll (async () => {
        await prisma.$disconnect ();
    });

    it ("Should signup the user", async () => {
        const requestUser = {
            name: "User name test",
            email: "Usermail@gmail.com",
            password: "UserPassword123",
        };

        const response = await request (app)
            .post ("/auth/signup")
            .send (requestUser);

        expect (response.status).toBe (201);
        expect (response.body).toHaveProperty ("id");
        expect (response.body).toHaveProperty ("name");
        expect (response.body).toHaveProperty ("email");
        expect (response.body).toHaveProperty ("createdAt");

        const savedUser = await prisma.user.findUnique ({ where: {id: response.body.id }});

        expect (savedUser).not.toBeNull ();
        expect (savedUser?.email).toBe ("usermail@gmail.com");
    })
});

describe ("login", () => {
    beforeEach (async () => {
        await clearDatabase ();
    })

    afterAll (async () => {
        await prisma.$disconnect ();
    });

    it ("Should login the user", async () => {
        const existingUser = {
            name: "User name test",
            email: "Usermail@gmail.com",
            password: "UserPassword123",
        };

        const existingUserResponse = await request (app)
            .post ("/auth/signup")
            .send (existingUser);

        console.log (existingUserResponse);

        expect (existingUserResponse.status).toBe (201);

        const userLoginRequest = {
            email: "Usermail@gmail.com",
            password: "UserPassword123",
        }

        const response = await request (app)
            .post ("/auth/login")
            .send (userLoginRequest);

        expect (response.status).toBe (200);
        expect (response.body).toHaveProperty ("challengeId");

        const challengeId = await prisma.loginChallenge.findFirst ({ where: {user_id: existingUserResponse.body.id}});

        expect (challengeId).not.toBeNull ();
    }, 15000);
});

// describe ("resendLoginCode", () => {
//     beforeEach (async () => {
//         await clearDatabase ();
//     })

//     afterAll (async () => {
//         await prisma.$disconnect ();
//     });

//     it ("Should resend login code", async () => {
//         const existingUser = {
//             name: "User name test",
//             email: "Usermail@gmail.com",
//             password: "UserPassword123",
//         };

//         const existingUserResponse = await request (app)
//             .post ("/auth/signup")
//             .send (existingUser);

//         expect (existingUserResponse.status).toBe (201);

//         const userLoginRequest = {
//             email: "Usermail@gmail.com",
//             password: "UserPassword123",
//         }

//         const sentLoginCode = await request (app)
//             .post ("/auth/login")
//             .send (userLoginRequest);

//         expect (sentLoginCode.status).toBe (200);
//         expect (sentLoginCode.body).toHaveProperty ("challengeId");

//         const challengeId = await prisma.loginChallenge.findFirst ({ where: {user_id: existingUserResponse.body.id}});

//         expect (challengeId).not.toBeNull ();

//         await sleep (62000)

//         const resentLoginCode = await request (app)
//             .post ("/auth/resend-code/" + sentLoginCode.body.challengeId);

//         console.log (resentLoginCode.body);

//         expect (resentLoginCode.status).toBe (200);
//         expect (resentLoginCode.body).toHaveProperty ("challengeId");
        
//     }, 1000 * 70);
// })
