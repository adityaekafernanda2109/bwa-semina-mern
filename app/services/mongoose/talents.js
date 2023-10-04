const Talents = require('../../api/v1/talents/model');

const { checkingImages } = require('./images');

const { NotFoundError, BadRequestError } = require('../../errors');

// api untuk mendapatkan data talents
const getAllTalents = async (req) => {
    const { keyword } = req.query;

    let condition = {};
    if (keyword) {
        condition = { ...condition, name: { $regex: keyword, $options: 'i' }};
    }

    const result = await Talents.find(condition)
    .populate({
        path: 'image',
        select: '_id name',
    })
    .select('_id name role image');

    return result;
};


// api untuk membuat talents
const createTalents = async (req) => {
    const { name, role, image } = req.body;
    // cari mage dengan file image
    await checkingImages(image);

    //cari talents dengan file name
    const check = await Talents.findOne({ name });

    //apabila check true/ data talents sudah ada maka tampilkan eror bad request dengan message pembicara nama duplikat
    if (check) throw new BadRequestError('Pembicara nama duplikat');

    const result = await Talents.create({ name, image, role });
    
    return result;
};


// api untuk getOne data talents
const getOneTalents = async (req) => {
    const { id } = req.params;

    const result = await Talents.findOne({ _id: id })
    .populate({
        path: 'image',
        select: '_id name',
    })
    .select('_id name role image');

    if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);
    
    return result;
};


// api untuk update talents
const updateTalents = async (req) => {
    const { id } = req.params;
    const { name, image, role } = req.body;
    // check image dengan field image
    await checkingImages(image);
    //cari talents dengan field nama dan id selain dari yang dikirim dari params
    const check = await Talents.findOne({
        name,
        _id: { $ne: id },
    });
    // apabila check true/data talents sudah ada maka kita tampilkan error bad request dengan message pembicara nama duplikat
    if (check) throw new BadRequestError(`Pembicara nama duplikat`);
    
    const result = await Talents.findOneAndUpdate(
        { _id: id },
        { name, image, role },
        { new: true, runValidators: true}
    );
    // jika id result false/null maka akan menampilkan error tidak ada pembicara dengan id tersebut
    if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);

    return result;
};


// api untuk menghapus talents
const deleteTalents = async (req) => {
    const { id } = req.params;

    const result = await Talents.findOne({
        _id : id,
    });

    if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);

    await result.deleteOne();
    return result;
};


// api unuk melakukan pengecekan talents
const checkingTalents = async (id) => {
    const result = await Talents.findOne({ _id: id });

    if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);
    return result;
};



module.exports = {
    getAllTalents,
    createTalents,
    getOneTalents,
    updateTalents,
    deleteTalents,
    checkingTalents,
};
