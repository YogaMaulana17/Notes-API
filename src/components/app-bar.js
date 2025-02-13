class AppBar extends HTMLElement {
  // Mendefinisikan atribut yang ingin diawasi perubahan nilainya
  static get observedAttributes() {
    return ["data-user"]; // Atribut "data-user" akan diawasi
  }

  constructor() {
    super(); // Memanggil constructor bawaan HTMLElement
    // Mengambil nilai awal atribut "data-user", jika tidak ada, default ke "User"
    this._user = this.getAttribute("data-user") || "User";
  }

  // Callback yang dipanggil saat elemen ditambahkan ke DOM
  connectedCallback() {
    this.render(); // Memanggil metode render untuk menampilkan elemen
  }

  // Callback yang dipanggil ketika atribut yang diawasi berubah
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-user") {
      // Mengecek jika atribut yang berubah adalah "data-user"
      this._user = newValue; // Memperbarui properti "_user" dengan nilai baru
      this.render(); // Memperbarui tampilan elemen
    }
  }

  // Fungsi untuk merender konten HTML elemen
  render() {
    this.innerHTML = `
      <header>
        <h1>NOTE APP</h1> <!-- Judul aplikasi -->
        <div>
          <p>Welcome, <span data-user>${this._user}</span>!</p> 
        </div>
      </header>
    `;
  }
}

// Mendefinisikan custom element "app-bar"
customElements.define("app-bar", AppBar);
