const Events = require('../../api/v1/events/model');
const { checkingImages } = require('./images');
const { checkingCategories } = require('./categories');
const { checkingTalents } = require('./talents');

const { NotFoundError, BadRequestError } = require('../../errors');
// const { path } = require('../../../app');

const getAllEvents = async (req) => {
    const { keyword, category, talent } = req.query;
    let condition = {};

    if (keyword) {
        condition = { ...condition, title: {$regex: keyword, $options: 'i'} };
    }

    if (category) {
        condition = { ...condition, category: category};
    }

    if (talent) {
        condition = { ...condition, talent: talent};
    }

    const result = await Events.find(condition)
        .populate({ path: 'image', select: '_id name' })
        .populate({
            path: 'category',
            select: '_id name',
        })
        .populate({
            path: 'talent',
            select: '_id name role image',
            populate: { path: 'image', select: '_id name' },
        });

        return result;
};


const createEvents = async (req) => {
    const {
        title,
        date,
        about,
        tagLine,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
    } = req.body;

    // cari image, category dan talent dengan field id
    await checkingImages(image);
    await checkingCategories(category);
    await checkingTalents(talent);

    // cari events dengan field name
    const check = await Events.findOne({ title });

    // apabila check true/ data events sudah ada maka kita tampilkan error badrequest
    if (check) throw new BadRequestError('Judul acara sudah ada');

    const result = await Events.create({
        title,
        date,
        about,
        tagLine,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
    });

    return result;
};


const getOneEvents = async (req) => {
    const { id } = req.params;

    const result = await Events.findOne({ _id: id })
    .populate({ path: 'image', select: '_id name' })
    .populate({
        path: 'category',
        select: '_id name',
    })
    .populate({
        path: 'talent',
        select: '_id name role image',
        populate: { path: 'image', select: '_id name' },
    });

        if (!result) throw new NotFoundError(`Tidak ada acara dengan id : ${id}`);
        
        return result;
};


const updateEvents = async (req) => {
    const { id } = req.params;
    const {
        title,
        date,
        about,
        tagLine,
        venueName,
        keyPoint,
        statusEvent,
        tickets,
        image,
        category,
        talent,
    } = req.body;

    await checkingImages(image);
    await checkingCategories(category);
    await checkingTalents(talent);

    // cari acara berdasarkan field id
    const checkEvent = await Events.findOne({
        _id: id,
    });

    // jika id result false / null maka akan menampilkan notfounderror
    if (!checkEvent) throw new NotFoundError(`Tidak ada acara dengan id : ${id}`);

    // cari acara berdasarkan field name dan id selain dari yang dikirimkan oleh params
    const check = await Events.findOne({
        title,
        _id: { $ne: id },
    });

    // check apabila true/data event telah ada maka kembalikan badrequesterror
    if (check) throw new BadRequestError('Judul acara sudah ada ');
    
    const result = await Events.findOneAndUpdate(
        { _id: id },
        {
            title,
            date,
            about,
            tagLine,
            venueName,
            keyPoint,
            statusEvent,
            tickets,
            image,
            category,
            talent,  
        },
        { new: true, runValidators: true}
    );


    return result;
};


const deleteEvents = async (req) => {
    const { id } = req.params;

    const result = await Events.findOne({
        _id: id,
    });

    if (!result) throw new NotFoundError(`Tidak ada acara dengan id : ${id}`);

    await result.deleteOne();
    return result;
};


module.exports = {
    getAllEvents,
    getOneEvents,
    createEvents,
    updateEvents,
    deleteEvents,
};




