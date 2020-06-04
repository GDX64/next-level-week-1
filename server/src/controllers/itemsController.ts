import { Response, Request } from 'express'
import knex from '../database/connection'

async function returnItems(req: Request, res: Response) {
    const items = await knex('items').select("*");

    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            imageURI: `http://localhost:5000/uploads/${item.image}`
        }
    })

    res.json(serializedItems)
}

export default returnItems