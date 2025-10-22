import { Request, Response, NextFunction } from 'express'
import { AtSer } from './atSer.entity.js'
import { Atencion } from '../atencion/atencion.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em


export async function findOne (req: Request, res: Response) {
    try {
        const id = Number(req.params.idAtSer);
        
        const atSer = await em.findOneOrFail(AtSer, { idAtSer: id }, {
            populate: ['atencion'] 
        });

        // Devolver la información necesaria, incluyendo el ID de la Atención
        return res.status(200).json({
            idAtSer: atSer.idAtSer,
            // Accedemos al id de la entidad Atención a través de la relación cargada
            idAtencion: atSer.atencion.idAtencion,  
        });

    } catch (error: any) {
        console.error(error);
        return res.status(404).json({ message: 'Atencion-Servicio no encontrado', error: error.message });
    }
};


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


