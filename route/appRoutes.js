import express from 'express'
import { inicio, categoria, buscador, pag404 } from '../controllers/appController.js'

const router = express.Router()


// Pagina de inicio
router.get('/', inicio)
//Categorias
router.get('/categorias/:id', categoria)
//Buscador
router.post('/buscador', buscador)

//pag 404
router.get('/404', pag404)


export default router
