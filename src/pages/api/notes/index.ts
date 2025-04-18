
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../authenticateUser";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const reqUser = authenticateUser(req, res);
    if (!reqUser) return;

    if (!['POST', 'GET', 'DELETE'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

    const { description, city } = req.body;
    //200 - ok

    //201 - created
    //400 - bad request
    //401 - unauthorized (nie ma konta)
    //403 - forbidden (blad uprawnien)
    //404 - not found


    // take on GET

    // create on POST
    if (req.method === 'POST') {

        if (typeof description !== 'string' && typeof city !== 'string') {
            return res.status(400).json({ message: 'Bad request' });
        }

        const note = await prisma.notes.create({
            data: {
                userId: reqUser.id,
                description: description,
                city: city
            }
        });
        return res.status(201).json(note);
    }

}