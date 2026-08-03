import MateriasRepository from '../repositories/materias-repository.js';

export default class MateriasService {
    constructor() {
        console.log('Estoy en: MateriasService.constructor()');
        this.MateriasRepository = new MateriasRepository();
    }

    getAllAsync = async (page, limit) => {
        console.log(`MateriasService.getAllAsync(page=${page}, limit=${limit})`);
        const resultado = await this.MateriasRepository.getAllAsync(page, limit);
        return resultado;
    }

    getByIdAsync = async (id) => {
        console.log(`MateriasService.getByIdAsync(${id})`);
        const returnEntity = await this.MateriasRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`MateriasService.createAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.MateriasRepository.createAsync(entity);
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`MateriasService.updateAsync(${JSON.stringify(entity)})`);
        const rowsAffected = await this.MateriasRepository.updateAsync(entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`MateriasService.deleteByIdAsync(${id})`);
        const rowsAffected = await this.MateriasRepository.deleteByIdAsync(id);
        return rowsAffected;
    }
}