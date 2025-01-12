import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

// CADASTRO
router.post('/cadastro', async (req, res) => {
    try{
    const user = req.body

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)

   const userDB = await prisma.user.create({
        data: {
            email: user.email,
            name: user.name,
            password: hashPassword, // pega a senha já encriptada
        },
    })
    res.status(201).json(userDB)
} catch (err) {
    res.status(500).json({message: "Erro no servidor,tente novamente."})
}
})

// LOGIN
router.post('/login', async (req, res) => {
    try{
        const userInfo = req.body

        // Busca usuário no banco de dados
        const user = await prisma.user.findUnique ({where: {email: userInfo.email},})

        // Verifica se existe usuário
        if (!user) {
            return res.status(404).json({message: "Usuário não encontrado."})
        }

        // Compara a senha do banco de dados com a senha digitada pelo usuário
        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        // Verifica se a senha é falsa
        if (!isMatch) {
            return res.status(400).json({message: "Senha inválida"})
        }

        // GERAR TOKEN JWT

        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1m'})

        res.status(200).json(token)

    } catch (err) {
        res.status(500).json({message: "Erro no servidor,tente novamente."})
    }
})

export default router

// jadsonnn
// hpQhapj9hs2IsXgZ
// mongodb+srv://jadsonnn:hpQhapj9hs2IsXgZ@users.6jwvf.mongodb.net/?retryWrites=true&w=majority&appName=Users
