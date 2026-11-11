require ('dotenv').config()

const fs = require ('fs')
const path = require ('path')
const express = require ('express')
const mysql = require ('mysql2/promise')
const bcrypt = require ('bycryptjs')
const jwt = require ('jsonwebtoken')
const crypto = require('crypto')
const cookieParser = require ('cookie-parser')
const Mustache = require ('mustache')

const app = express ()

app.use(express.urlencoded({extended: false}))

app.use(cookieParser())

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateString: true // 
})

app.use((req, res, next) => {
    const metodo = String(req.body?._method || '').toUpperCase() // se tiver vazia não preciso executar a conversão do POST/DELETE

    if(req.method === 'POST' && ['PUT', 'DELETE'].includes(metodo)){ // vou colocar valor ou de POST ou de DELETE, apenas uma, dentro de metodo
        req.method = metodo
    }
    next()
})

function mostrar(nome, dados = {}){
    const arquivo = path.join(__dirname, 'paginas', `${nome}.html`)

    return mustache.render(fs.readFileSync(arquivo, 'utf8'), dados)
}

function criptografar(texto){
    const cifra = crypto.createCipheriv('aes-256-cdc', process.env.CRIPTO_CHAVE, process.env.CRIPTO_IV)

    return cifra.update(texto, 'utf8', 'hex') + cifra.final('hex')
}

function descriptografar(texto){
    const decifra = crypto.createDecipheriv('aes-256-cdc', process.env.CRIPTO_CHAVE, process.env.CRIPTO_IV)

    return decifra.update(texto, 'hex', 'utf8') + decifra.final('utf8')
}

async function excluir(res, tabela, id, volta, motivo){
    try {
        await db.query(`DEELETE FROM ${tabela} WHERE id = ?`, [id])
        
        res.redirect(volta)
    } catch(error){
        if(error.code === 'ER_ROW_ID_REFERENCED_2'){
            return res.status(409).send(`<p>Nao foi possivel excluir: ${motivo}.</p><p><a href="${volta}">Voltar</a></p>`)
        }
        console.error(error)
        res.status(500).send(`<p>Erro ao excluir. </p><p><a href="${volta}">Voltar</a></p>`)
    }
}

app.get('/', (req, res) => {
    res.send(mostrar('login'))
})

app.post('/login', async (req, res) => {
    
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Oficina TORQUE rodando em HTTP://localhost:${port}`)
})