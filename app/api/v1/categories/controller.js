// menghandle semua controller, tapi logicnya ada diservice, controller hanya berperan sebagai pemanggil

const { StatusCodes } = require('http-status-codes');
const { getAllCategories, createCategories, getOneCategories, updateCategories, deleteCategories } = require('../../../services/mongoose/categories.js')

//parameter next untuk menampung nilai dari error yang tidak dapat diduga, 
//error yang nantinya ditampung oleh next akan ditampilkan oleh custom error

const create = async(req, res, next) => {
    try {
        const result = await createCategories(req);
        res.status(StatusCodes.CREATED).json({
            data:result
        });
    } catch (err) {
        next(err);
    }
}


const index = async(req, res, next) => {
    try {
        const result = await getAllCategories(req);
        res.status(StatusCodes.OK).json({
            data:result,
        });
    } catch (err) {
        next(err);
    }
}


const find = async(req, res, next) => {
    try {
       const result = await getOneCategories(req);
       res.status(StatusCodes.OK).json({
            data:result,
       }); 
    } catch (err) {
        next(err)
    }
}


const update = async(req, res, next) => {
    try {
        const result = await updateCategories(req);
        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
}


const destroy = async(req, res, next) => {
    try {
        const result = await deleteCategories(req);
        res.status(StatusCodes.OK).json({
            data: result,
        });
    } catch (err) {
        next(err);
    }
}





module.exports = {
    create,
    index,
    find,
    update,
    destroy,
}