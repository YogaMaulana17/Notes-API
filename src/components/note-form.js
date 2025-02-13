class NoteForm extends HTMLElement {
  connectedCallback() {
    // Memanggil metode untuk merender elemen dan mengatur validasi
    this.render();
    this.setupValidation();
  }

  render() {
    // Menyisipkan HTML untuk form catatan
    this.innerHTML = `
      <form id="note-form">
        <input type="text" id="title" class="input-field" placeholder="Title" required />
        <textarea id="body" class="input-field" placeholder="Body" required></textarea>
        <button type="submit" id="form-submit"><i class="bi bi-pencil-square"></i> Add Note</button>
      </form>
    `;
  }

  setupValidation() {
    const form = this.querySelector("#note-form"); // Referensi elemen form
    const titleInput = this.querySelector("#title"); // Input untuk judul
    const bodyInput = this.querySelector("#body"); // Input untuk isi catatan

    // Validasi realtime untuk input judul
    titleInput.addEventListener("input", () => {
      if (titleInput.value.trim() === "") {
        titleInput.setCustomValidity("Judul Harus Di Isi!!"); // Pesan error jika judul kosong
      } else {
        titleInput.setCustomValidity(""); // Tidak ada error jika valid
      }
      titleInput.reportValidity(); // Menampilkan pesan validasi
    });

    // Validasi realtime untuk input isi catatan
    bodyInput.addEventListener("input", () => {
      if (bodyInput.value.trim().length < 10) {
        bodyInput.setCustomValidity(
          "Catatan Minimal 10 Karakter" // Pesan error jika kurang dari 10 karakter
        );
      } else {
        bodyInput.setCustomValidity(""); // Tidak ada error jika valid
      }
      bodyInput.reportValidity(); // Menampilkan pesan validasi
    });

    // Menangani pengiriman form
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Mencegah reload halaman

      // Membuat ID unik berbasis timestamp
      const id = `note-${Date.now()}`; // Contoh: note-1678901234567

      // Membuat custom event dengan data form
      const noteEvent = new CustomEvent("submit-note", {
        detail: {
          id, // Tambahkan ID unik
          title: titleInput.value.trim(), // Mengambil nilai judul
          body: bodyInput.value.trim(), // Mengambil nilai isi catatan
          date: new Date().toISOString(), // Membuat timestamp valid
        },
        bubbles: true, // Event dapat didengar oleh parent
        cancelable: true, // Event dapat dibatalkan
      });
      this.dispatchEvent(noteEvent); // Mengirimkan custom event

      // Mengosongkan input setelah berhasil disubmit
      titleInput.value = "";
      bodyInput.value = "";
    });
  }
}

// Mendefinisikan custom element dengan nama "note-form"
customElements.define("note-form", NoteForm);
