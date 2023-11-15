const fs = require("fs");

// Membuat folder jika belum ada
const lokasiDirr = "./data";
if (!fs.existsSync(lokasiDirr)) {
  fs.mkdirSync(lokasiDirr);
}

//membuat file contacts.json jika belum ada
const filePath = `./data/contacts.json`;
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

//load contacts
const fetchContact = () => {
  //Membaca file JSON
  const file = fs.readFileSync(filePath, "utf8");
  const contacts = JSON.parse(file);
  return Array.isArray(contacts) ? contacts : [];
};

// Cari contact
const searchContact = (nama) => {
  const contacts = fetchContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// Menambahkan data contact baru json
const addContact = (contact) => {
  const contacts = fetchContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// duplicate check
const duplicateCheck = (nama) => {
  const contacts = fetchContact();
  return contacts.find((contact) => contact.nama === nama);
};

module.exports = { addContact, fetchContact, searchContact, duplicateCheck };
