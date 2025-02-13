// Import data
// import { notesData } from "./notesData.js";
import Swal from "sweetalert2";
import gsap from "gsap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./components/app-bar.js";
import "./components/note-form.js";
import "./components/note-item.js";
import "./components/loading-indicator.js";
import "./style/style.css";

// document.addEventListener("DOMContentLoaded", () => {
//   const noteListElement = document.getElementById("note-list-local");

//   // merender daftar catatan ke dalam elemen HTML
//   function renderNotes() {
//     noteListElement.innerHTML = ""; // Mengosongkan isi elemen daftar catatan
//     notesData.forEach((note) => {
//       const noteItem = document.createElement("note-item"); // Membuat elemen custom note-item
//       noteItem.note = note; // Mengatur properti 'note' dengan data catatan
//       noteListElement.appendChild(noteItem); // Menambahkan elemen note-item ke dalam daftar catatan
//     });
//   }

//   // custom event "submit-note"
//   document.body.addEventListener("submit-note", (event) => {
//     const { title, body, date } = event.detail; // Mendapatkan data yang dikirim melalui event.detail

//     // Membuat objek catatan baru
//     const newNote = {
//       id: `notes-${Date.now()}`, // ID unik berdasarkan timestamp
//       title, // Judul catatan
//       body, // Isi catatan
//       createdAt: date, // Tanggal pembuatan catatan
//       archived: false, // Status arsip catatan, default: false
//     };

//     // Menambahkan catatan baru ke dalam array notesData
//     notesData.push(newNote);

//     // Memperbarui tampilan daftar catatan dengan data baru
//     renderNotes();
//   });

//   // Merender catatan awal saat aplikasi pertama kali dimuat
//   renderNotes();
// });

document.addEventListener("DOMContentLoaded", () => {
  const baseURL = "https://notes-api.dicoding.dev/v2/notes";
  const noteListApiElement = document.getElementById("note-list-api");
  const archiveListElement = document.getElementById("archive-list-api");
  const formElement = document.getElementById("note-form");
  const loadingIndicator = document.querySelector("loading-indicator");

  let isEditMode = false;
  let editingNoteId = null;

  // Fungsi untuk mengambil semua catatan
  const getNotes = async () => {
    try {
      loadingIndicator.show();

      // Ambil catatan aktif
      const activeResponse = await fetch(`${baseURL}`);
      if (!activeResponse.ok) throw new Error("Gagal mengambil catatan aktif!");
      const activeData = await activeResponse.json();

      // Ambil catatan arsip
      const archivedResponse = await fetch(`${baseURL}/archived`);
      if (!archivedResponse.ok)
        throw new Error("Gagal mengambil catatan arsip!");
      const archivedData = await archivedResponse.json();

      // Kosongkan daftar sebelum merender ulang
      noteListApiElement.innerHTML = "";
      archiveListElement.innerHTML = "";

      // Render catatan aktif
      activeData.data.forEach((note) => {
        const noteItem = document.createElement("note-item");
        noteItem.note = note;

        // Menangani event tombol hapus
        noteItem.addEventListener("click", async (event) => {
          if (event.target.classList.contains("delete")) {
            await deleteNote(note.id);
          } else if (event.target.classList.contains("archive")) {
            await toggleArchive(note.id, note.archived);
          }
        });

        noteListApiElement.appendChild(noteItem);
        gsap.from(noteItem, { opacity: 0, scale: 0.8, duration: 0.5 });
      });

      // Render catatan arsip
      archivedData.data.forEach((note) => {
        const noteItem = document.createElement("note-item");
        noteItem.note = note;

        // Menangani event tombol hapus atau kembalikan
        noteItem.addEventListener("click", async (event) => {
          if (event.target.classList.contains("delete")) {
            await deleteNote(note.id);
          } else if (event.target.classList.contains("unarchive")) {
            await toggleArchive(note.id, note.archived);
          }
        });

        archiveListElement.appendChild(noteItem);
        gsap.from(noteItem, { opacity: 0, x: 100, duration: 0.5 });
      });
    } catch (error) {
      console.error("Error saat mengambil data:", error);
      noteListApiElement.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    } finally {
      loadingIndicator.hide();
    }
  };

  // Fungsi untuk mengarsipkan/mengembalikan catatan
  const toggleArchive = async (id, isArchived) => {
    try {
      loadingIndicator.show();

      console.log("ID yang dikirim:", id); // Debugging ID
      console.log("Status arsip sebelumnya:", isArchived);

      // Tentukan endpoint berdasarkan status arsip
      const endpoint = isArchived ? "unarchive" : "archive";
      const response = await fetch(`${baseURL}/${id}/${endpoint}`, {
        method: "POST", // Gunakan POST untuk arsip & unarsip
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      console.log("Respons dari API:", result); // Debugging respons API

      if (!response.ok) throw new Error(result.message);

      Swal.fire({
        icon: "success",
        title: isArchived ? "Catatan dikembalikan!" : "Catatan diarsipkan!",
        timer: 2000,
      });

      getNotes(); // Perbarui daftar catatan
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal mengubah status arsip: ${error.message}`,
      });
    } finally {
      loadingIndicator.hide();
    }
  };

  // Fungsi untuk menambahkan catatan baru
  const addNote = async (title, body) => {
    try {
      loadingIndicator.show();
      const response = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Catatan berhasil ditambahkan!",
        timer: 2000,
      });

      resetForm();
      getNotes();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: `Gagal menambahkan catatan: ${error.message}`,
      });
    } finally {
      loadingIndicator.hide();
    }
  };

  // Fungsi untuk menghapus catatan
  const deleteNote = async (id) => {
    try {
      loadingIndicator.show();
      const response = await fetch(`${baseURL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Catatan berhasil dihapus!",
        timer: 2000,
      });

      getNotes();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Gagal menghapus catatan: ${error.message}`,
      });
    } finally {
      loadingIndicator.hide();
    }
  };

  // Fungsi untuk mereset form setelah catatan ditambahkan
  const resetForm = () => {
    formElement.querySelector("#title").value = "";
    formElement.querySelector("#body").value = "";
    formElement.querySelector("#form-submit").textContent = "Add Note";
    isEditMode = false;
    editingNoteId = null;
  };

  // Menangani form submit (Tambah atau Edit)
  document.addEventListener("submit-note", async (event) => {
    const { title, body } = event.detail;

    if (isEditMode && editingNoteId) {
      updateNote(editingNoteId, title, body);
    } else {
      addNote(title, body);
    }
  });

  // Panggil fungsi untuk mengambil catatan saat halaman dimuat
  getNotes();
});
