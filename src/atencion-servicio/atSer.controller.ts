import { Request, Response, NextFunction } from 'express'
import { AtSer } from './atSer.entity.js'
import { Atencion } from '../atencion/atencion.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

// export async function findAll(req: Request, res: Response) {
//     try {
//         const atSers = await em.find(
//         AtSer,
//         {},
//         { populate: ['tonosUtilizados', 'productosUtilizados', 'atencion', 'servicio']}
//         )
//         res.status(200).json({ message: 'found all servicios - atenciones ', data: atSers })
//     } catch (error: any) {
//         res.status(500).json({ message: error.message })
//     }
// }


export async function ServiciosPorAtencion(req: Request, res: Response) {
    try {
        const idAtencion = Number.parseInt(req.params.idAtencion)
        if (!idAtencion) {
            return res.status(401).json({ message: "No se encontró una atencion con ese id" });
        }

        const atencion = await em.findOneOrFail(Atencion,{ idAtencion });
        const serviciosAten = await em.find(
        AtSer,
        { atencion: atencion},
        { populate: [ 'productosUtilizados', 'atencion', 'servicio']}
        )
        res.status(200).json({ message: 'found all servicios - atenciones ', data: serviciosAten })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


