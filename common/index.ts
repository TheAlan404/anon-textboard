import { Prisma, MessageStatus } from "@prisma/client";
import { z } from "zod";
import { CONFIG } from "./config";

export type { MessageStatus };

export type Message = z.infer<typeof MessageSchema>;
export const MessageSchema = z.object({
    id: z.number(),
    author: z.string().max(CONFIG.maxAuthorLength).nullable(),
    content: z.string().max(CONFIG.maxContentLength),
    status: z.enum(["pending", "approved", "deleted"]),
    updatedAt: z.date(),
}) satisfies z.ZodType<Prisma.MessageGetPayload<{}>>;
