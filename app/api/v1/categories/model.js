// Untuk menyimpan schema dari kategori dalam database
// schema untuk menentukan field-field dalam database, seperti tipe data field dll
// juga bisa untuk konfigurasi validation mulai dari require, panjang karakter, max karakter dll

const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let categorySchema = Schema(
    {
        name: {
            type: String,
            minLength: [ 3, 'Panjang nama kategori minimal 3 karakter '],
            maxLength: [20, 'Panjang nama kategori maksimal 20 karakter '],
            required: [true, 'Nama kategori harus diisi ']
        },  //field untuk nama kategori
        organizer: {
            type: mongoose.Types.ObjectId,
            ref: 'organizer',
            required: true,
        },
    },
    { timestamps: true } // fungsi untuk setiap create dan update akan menampilkan waktu
);

module.exports = model('Category' , categorySchema);