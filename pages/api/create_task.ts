import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/model/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const task = await prisma.task.create({
			data: {
				title: req.body.title,
				description: req.body.description,
				priority: req.body.priority,
				status: req.body.status,
				sprint: req.body.sprint,
				dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
			}
		});

		res.status(200).json(task);
	} catch (e) {
		res.status(400).json(e);
	}
}
