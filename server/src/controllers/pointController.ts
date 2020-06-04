import { Response, Request } from 'express'
import knex from '../database/connection'

async function indexPoint(req: Request, res: Response) {
    const { city, uf, items } = req.query

    console.info({ city, uf, items });

    const parsedItems = String(items)
        .split(',').map(item => Number(item.trim()));

    const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct().select('points.*')

    return res.json(points)
}

async function showPoint(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first()

    const items = await knex('items').
        join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)

    if (!point) {
        return res.status(400).json({})
    }

    res.json({ point, items })
}

async function createPoint(req: Request, res: Response) {
    console.log(req.body)
    let
        {
            name,
            email,
            whatsapp,
            city,
            uf,
            longitude,
            latitude,
            items
        } = req.body

    const trx = await knex.transaction()
    console.log("creating point");

    const point = {
        image: 'fake-image',
        name,
        email,
        whatsapp,
        city,
        uf,
        longitude,
        latitude
    };
    console.log(point);

    const newID = await trx('points').insert(point)

    const pointsToInsert = items.map((id: Number) => {
        return {
            item_id: id,
            point_id: newID[0]
        }
    });

    await trx('point_items').insert(pointsToInsert);
    await trx.commit()
    res.json({ ...point, id: newID[0] })
}

export { showPoint, createPoint, indexPoint }