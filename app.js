const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  addContact,
  fetchContact,
  searchContact,
  duplicateCheck,
} = require("./utility/contacts.js");
const { body, validationResult } = require("express-validator");

const app = express();
// Konfigurasi alamat host dan port
const host = "localhost"; // alamat host
const port = 3000; // alamat port

// Mengatur view engine menggunakan EJS
app.set("view engine", "ejs");

app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    namaWeb: "around world.",
    title: "around world.",
    layout: "layout/core-layout",
  });
});

// Handle permintaan GET ke "/about" dan mengirimkan file "about.html"
app.get("/about", (req, res) => {
  res.render("about", {
    title: "around world. - About",
    layout: "layout/core-layout",
  });
});

// Handle permintaan GET ke "/contact" dan mengirimkan file "contact.html"
app.get("/contact", (req, res) => {
  const contacts = fetchContact();

  if (contacts.length === 0) {
    // Menampilkan pesan pemberitahuan jika objek contacts kosong
    res.render("contact", {
      title: "around world. - Contact",
      contacts,
      isEmpty: true, // Variabel flag untuk menunjukkan bahwa objek kosong
      layout: "layout/core-layout.ejs", // Ejs core layout
    });
  } else {
    res.render("contact", {
      title: "around world. - Contact",
      contacts,
      isEmpty: false, // Variabel flag untuk menunjukkan bahwa objek tidak kosong
      layout: "layout/core-layout.ejs", // Ejs core layout
    });
  }
});

// Menghandle permintaan GET untuk endpoint "/contact/add"
app.get("/contact/add", (req, res) => {
  // Merender tampilan "add-contact" dengan parameter yang ditentukan
  res.render("add-contact", {
    title: "around world. - Add Contact",
    layout: "layout/core-layout.ejs",
  });
});

// Menghandle permintaan POST untuk endpoint "/contact"
// Definisi endpoint POST "/contact"
app.post(
  "/contact",
  [
    // Middleware menggunakan express-validator untuk memvalidasi data
    body("nama").custom((value) => {
      // Memeriksa apakah nilai nama sudah terdaftar (menggunakan fungsi duplicateCheck)
      const duplicate = duplicateCheck(value);
      // Jika nilai nama sudah terdaftar, lemparkan error
      if (duplicate) {
        throw new Error("Nama sudah terdaftar!!");
      }
      // Jika tidak ada error, kembalikan true untuk menunjukkan validasi berhasil
      return true;
    }),
  ],
  // Handler untuk mengelola permintaan POST
  (req, res) => {
    // Mengambil hasil validasi dari permintaan
    const errors = validationResult(req);

    // Memeriksa apakah ada error validasi
    if (!errors.isEmpty()) {
      // Jika ada error, menampilkan halaman "add-contact" dengan pesan error
      res.render("add-contact", {
        title: "around world - Add Contact",
        layout: "layout/core-layout.ejs",
        errors: errors.array(),
      });
    } else {
      // Jika tidak ada error validasi,
      // Memanggil fungsi addContact dengan data dari tubuh permintaan (request body)
      addContact(req.body);
      // Mengarahkan pengguna ke halaman "/contact" setelah berhasil menambahkan kontak
      res.redirect("/contact");
    }
  }
);

// middleware untuk detail contact
app.get("/contact/:nama", (req, res) => {
  const contact = searchContact(req.params.nama);

  res.render("detail", {
    title: "around world. - Detail Contact",
    contact,
    isEmpty: true, // Variabel flag untuk menunjukkan bahwa objek kosong
    layout: "layout/core-layout.ejs", // Ejs core layout
  });
});

// Middleware untuk menangani permintaan yang tidak sesuai dengan rute yang ada
app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>Not Found</h1>");
});

// Menjalankan server Express pada host dan port yang ditentukan
app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
