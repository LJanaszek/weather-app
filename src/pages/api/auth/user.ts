import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const pattern: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
){
  if (!['POST', 'GET', 'PUT'].includes(req.method)) return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

  if(req.method == "POST"){ // L
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findFirst({
      where:{
        username:username
      }
    })
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    res.setHeader("Set-Cookie", serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    }));

    return res.status(200).json({ message: "Login successful" });
  }
  else if(req.method == "PUT"){ // R
    const { username, password, secPassword} = req.body;

    if (!username || !password || !secPassword) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findFirst({
      where:{
        username:username
      },
      select:{
        id:true
      }
    })

    if(user){
      return res.status(409).json({message:"Username is already taken"})
    }

    if(password != secPassword){
      return res.status(400).json({message:"Passwords are not matching"})
    }

    if(!pattern.test(password)){
      return res.status(400).json({message:"Passwords does not meet requirements"})
    }
    
    const newUser = await prisma.user.create({
      data:{
        username:username,
        password:bcrypt.hashSync(password, 10),
      }
    })

    const token = jwt.sign({ id: newUser.id, username: username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set token in HTTP-only cookie
    res.setHeader("Set-Cookie", serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    }));

    return res.status(201).json({message:"User created", id:newUser.id})
  }
  else if(req.method == "GET"){
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.auth_token;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(401).json({ message: "Invalid token + " + error.message || "" });
    }
  }
}