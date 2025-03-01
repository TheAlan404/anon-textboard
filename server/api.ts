import { Router } from "express";
import { z } from "zod";
import { Prisma, PrismaClient } from '@prisma/client'
import { CONFIG } from "~/config";

const prisma = new PrismaClient()

const api: Router = Router();

api.get("/api/messages", async (req, res) => {
    let page = Number(req.query.page) || 1;
    let admin_key = String(req.query.admin_key) || "";

    if(page < 1) page = 1;

    const where: Prisma.MessageWhereInput = {
        status: admin_key === process.env.ADMIN_KEY ? "pending" : "approved",
    };

    const [count, messages] = await prisma.$transaction([
        prisma.message.count({ where }),
        prisma.message.findMany({
            where,
            take: CONFIG.itemsPerPage,
            skip: (page - 1) * CONFIG.itemsPerPage,
        }),
    ]);

    res.json({
        pageCount: Math.ceil(count / CONFIG.itemsPerPage),
        count,
        messages,
    });
});

api.post("/api/post", async (req, res) => {
    console.log("req.body", req.body)

    const { content, author } = z.object({ content: z.string(), author: z.string().nullish() }).parse(req.body);

    await prisma.message.create({
        data: {
            content,
            author,
        },
    });

    res.status(200).json("OK");
});

api.post("/api/admin", async (req, res) => {
    let admin_key = String(req.query.admin_key) || "";

    if(admin_key !== process.env.ADMIN_KEY) {
        res.status(401).json("Unauthorized");
        return;
    };

    const { action, id } = z.object({
        action: z.enum(["approved", "deleted"]),
        id: z.number(),
    }).parse(req.body);

    await prisma.message.update({
        where: { id },
        data: {
            status: action,
        },
    });

    res.status(200).json("OK");
});

export default api;
