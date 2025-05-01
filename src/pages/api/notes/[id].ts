import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../authenticateUser";

const prisma = new PrismaClient();



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const { description } = req.body;

    const reqUser = await authenticateUser(req, res);
    if (!reqUser) return;

    if (req.method === 'GET') {
        try {
            const notes = await prisma.notes.findMany({
                where: {
                    userId: reqUser.id,
                    city: id as string
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return res.status(200).json(notes);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }



    if (req.method === 'DELETE') {
        try {
            await prisma.notes.deleteMany({
                where: {
                    id: String(id)
                }
            })
            return res.status(200).json({ message: 'Notes deleted' });
        }
        catch (error) {

            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            await prisma.notes.update({
                where: {
                    id: String(id)
                },
                data: {
                    description: description
                }

            })
            return res.status(200).json({ message: 'Notes updated' });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

}