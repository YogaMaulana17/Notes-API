class NoteItem extends HTMLElement {
  // Setter untuk properti "note" yang akan menerima data dari luar
  set note(data) {
    // Menyisipkan struktur HTML untuk setiap item catatan
    this.innerHTML = `
      <div class="note-item">
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <small>${new Date(data.createdAt).toLocaleDateString()}</small>
      </div>
        <div class="actions">
            <button class="delete"><i class="bi bi-trash"></i> Hapus</button>
            ${
              data.archived
                ? `<button class="unarchive"><i class="bi bi-arrow-repeat"></i> Balikan</button>`
                : `<button class="archive"><i class="bi bi-archive-fill"></i> Arsipkan</button>`
            }
        </div>
    `;
  }
}

// Mendefinisikan custom element dengan nama "note-item"
customElements.define("note-item", NoteItem);
