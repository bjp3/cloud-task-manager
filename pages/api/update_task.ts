import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, title, description, priority, status, sprint, dueDate } = req.body;

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: { title, description, priority, status, sprint, dueDate },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
}
