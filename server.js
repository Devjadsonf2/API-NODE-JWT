import express from 'express' // importa o express
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'

import auth from './middlewares/auth.js'

const app = express() // guarda o express numa variável
app.use(express.json()) // avisa à aplicação que vou usar json

app.use('/', publicRoutes)
app.use('/', auth, privateRoutes)

app.listen(3000, () => console.log("Servidor Rodando.")) // define a porta para o express