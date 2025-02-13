class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.style.display = "none"; // Default: disembunyikan
    this.innerHTML = `
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <style>
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #fff;
          border-top: 5px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  show() {
    this.style.display = "flex"; // Tampilkan loading
  }

  hide() {
    this.style.display = "none"; // Sembunyikan loading
  }
}

customElements.define("loading-indicator", LoadingIndicator);
