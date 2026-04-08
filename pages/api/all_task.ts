import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/model/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const tasks = await prisma.task.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	});

	return res.status(200).json(tasks)
}
