import { Prisma, MessageStatus } from "@prisma/client";
import { z } from "zod";

export type { MessageStatus };

export type Message = z.infer<typeof MessageSchema>;
export const MessageSchema = z.object({
    id: z.number(),
    author: z.string().nullable(),
    content: z.string(),
    status: z.enum(["pending", "approved", "deleted"]),
    updatedAt: z.date(),
}) satisfies z.ZodType<Prisma.MessageGetPayload<{}>>;
