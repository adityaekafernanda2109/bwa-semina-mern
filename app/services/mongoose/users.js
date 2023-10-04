const Users = require('../../api/v1/users/model');
const Organizers = require('../../api/v1/organizers/model');
const { BadRequestError } = require('../../errors');
const { StatusCodes } = require('http-status-codes');


const createOrganizers = async (req) => {
    const { organizer, role, email, password, confirmPassword, name } = req.body;

    if(password !== confirmPassword) {
        throw new BadRequestError('Password dan Konfirmasi Password tidak cocok');
    }

    const result = await Organizers.create({ organizer });

    const users = await Users.create({
        name,
        email,
        password,
        organizer : result._id,
        role,
    });

    // _doc dapat memanipulasi data dari hasil result, dapat melakukan delete password
    // delete password agar password tidak tampil direspon
    delete users._doc.password;

    return users;
};


const createUsers = async (req, res) => {
    const { name, password, role, confirmPassword, email } = req.body;

    if (password !== confirmPassword) {
        throw new BadRequestError('Password dan Konfirmasi Password tidak cocok');
    }

    const result = await Users.create({
        name,
        email,
        organizer: req.user.organizer,
        password,
        role,
    });

    return result;
}


module.exports = {
    createOrganizers,
    createUsers,
};