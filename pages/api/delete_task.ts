import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/model/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await prisma.task.delete({
			where: {
				id: req.body.id
			},
		});

		res.status(200).json('success');
	} catch (e) {
		res.status(400).json(e);
	}
}
