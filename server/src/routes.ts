import express, { Router } from 'express'
import { createPoint, showPoint, indexPoint } from './controllers/pointController'
import returnItems from './controllers/itemsController'

const routes = express.Router()

routes.get('/', (req, res) => {

    res.send('Hello')
})

routes.get('/point/:id', showPoint)

routes.get('/points', indexPoint)

routes.get('/items', returnItems)

//POST POINT
routes.post("/points", createPoint)


export default routes