import AlumnosRepository from '../repositories/alumnos-repository.js';
import CursosService from './cursos-service.js';
import { calcularEdad, agregarEdad } from '../helpers/fechas-helper.js';
import AppError from '../helpers/app-error.js';
import { StatusCodes } from 'http-status-codes';

export default class AlumnosService {
    constructor() {
        console.log('Estoy en: AlumnosService.constructor()');
        this.AlumnosRepository = new AlumnosRepository();
        this.CursosService = new CursosService();
    }

    getAllAsync = async (page, limit) => {
        console.log(`AlumnosService.getAllAsync(page=${page}, limit=${limit})`);
        const resultado = await this.AlumnosRepository.getAllAsync(page, limit);
        if (resultado == null) return null;
        return {
            ...resultado,
            data: resultado.data.map(alumno => agregarEdad(alumno))
        };
    }

    getByIdAsync = async (id) => {
        console.log(`AlumnosService.getByIdAsync(${id})`);
        const returnEntity = await this.AlumnosRepository.getByIdAsync(id);
        return agregarEdad(returnEntity);
    }

    createAsync = async (entity) => {
        console.log(`AlumnosService.createAsync(${JSON.stringify(entity)})`);
        await this.validarCursoExiste(entity.id_curso);
        const rowsAffected = await this.AlumnosRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`AlumnosService.updateAsync(${JSON.stringify(entity)})`);
        if (entity.id_curso) {
            await this.validarCursoExiste(entity.id_curso);
        }
        const rowsAffected = await this.AlumnosRepository.updateAsync(entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`AlumnosService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.AlumnosRepository.deleteByIdAsync(id);
        return rowsAffected;
    }

    validarCursoExiste = async (idCurso) => {
        if (!idCurso) return;
        const curso = await this.CursosService.getByIdAsync(idCurso);
        if (curso == null) {
            throw new AppError(`El curso con id ${idCurso} no existe.`, StatusCodes.BAD_REQUEST);
        }
    }
}