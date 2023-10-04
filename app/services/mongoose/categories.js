const Categories = require('../../api/v1/categories/model');
const { BadRequestError, NotFoundError } = require('../../errors');

// api untuk mendapatkan semua categories
const getAllCategories = async (req) => {
    // menampilkan data berdasarkan user yang login
    const result = await Categories.find({ organizer: req.user.organizer });

    return result;
};


// api untuk membuat categories
const createCategories = async (req) => {
    const { name } = req.body;
    // mencari categories dengan field name
    const check = await Categories.findOne({ name });
    //apabila terdapat nama categories yang sama, maka akan menampilkan bad request
    if (check) throw new BadRequestError('Nama kategori duplikat');

    const result = await Categories.create({ name, organizer: req.user.organizer });

    return result;
};


// api untuk mendapatkan satu categories
const getOneCategories = async (req) => {
    const { id } = req.params;

    const result = await Categories.findOne({ _id: id, organizer: req.user.organizer });

    if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);

    return result;
};


// api untuk mengubah data categories
const updateCategories = async (req) => {
    const { id } = req.params;
    const { name } = req.body;

    const check = await Categories.findOne({
        name,
        _id: { $ne: id },
        organizer: req.user.organizer
    });

    // apabila check true/data categories telah ada maka tampilkan bad request error
    if (check) throw new BadRequestError('Kategori nama duplikat');

    const result = await Categories.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true, runValidators: true }
    );

    // jika id result false/null maka akan menampilkan pesan notfound dengan id kategori
    if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);
    
    return result;
};


// api untuk menghapus data
const deleteCategories = async (req) => {
    const { id } = req.params;

    const result = await Categories.findOne({ _id: id, organizer: req.user.organizer });

    if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);
    await result.deleteOne();
    return result;
};


// api untuk melakukan pengecekan category ada atau tidak
const checkingCategories = async (id) => {
    const result = await Categories.findOne({ _id: id });

    if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);

    return result;
};

module.exports = {
    getAllCategories,
    createCategories,
    getOneCategories,
    updateCategories,
    deleteCategories,
    checkingCategories,
};