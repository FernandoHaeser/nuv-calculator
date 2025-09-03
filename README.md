
<h1 align="center"><b>nuv-calculator-web</b></h1>

<div align="center">
<b>Empowering Smarter Storage Decisions Instantly</b><br>

<br>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-stable-brightgreen)
<img src="https://img.shields.io/github/last-commit/FernandoHaeser/nuv-calculator" alt="last update" />
![Language](https://img.shields.io/badge/language-HTML%2FCSS%2FJS%2FPHP%2FJAVA-yellow)
![Issues](https://img.shields.io/github/issues/FernandoHaeser/nuv-calculator)
![Stars](https://img.shields.io/github/stars/FernandoHaeser/nuv-calculator?style=social)
</div>

------

## 📖 Table of Contents
- [Overview](##📌Overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Author](#author)

---

## 📌 Overview
**NUVCalc** is an interactive web tool designed to simplify **storage calculations** and **license estimation**.  
It combines consumption calculations with an accessible, lightweight web interface that runs directly in the browser.

- 🌍 100% client-side, works offline  
- ⚡ Instant calculations with no external dependencies  
- 🔐 Ready for optional API integration for advanced use  

---

## ✨ Features
- 📊 **Estimated Calculation** – Calculate the total disk space (TB) required for a set of subscription licenses.  
- 🧩 **License Optimization** – Find the best combinations of subscription licenses that fit into a fixed disk space.  
- ⚡ **Fast & Lightweight** – Real-time calculations in the browser.  
- 🔗 **Portable** – Run locally without complex installation.  
- 🖥️ **User-Friendly UI** – Clean layout, responsive design, intuitive workflow.  

---

## 🖼️ Screenshots

<p align="center">
  <img src="docs/screenshot1.png" width="45%" alt="Main Menu">
  <img src="docs/screenshot2.png" width="45%" alt="Calculation Page">
</p>

---

## 🚀 Getting Started

### ✅ Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari).

### 💻 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/FernandoHaeser/nuv-calculator-web.git
   cd nuv-calculator-web
``

2. Open the project:

   * Directly open `index.html` in your browser
   * Or run a local server (optional):

     ```bash
     npx http-server
     ```

### 🎯 Usage

From the main menu (`index.html`) you can access:

* **Estimated Calculation** → Calculate total TB consumed by a list of subscriptions.
* **Subscription Combinations** → Find the best license sets for a given disk space.

---

## 📂 Project Structure

```bash
NUVCalc/
├── css/
│   └── estimado.css       # Styles for UI
├── js/
│   ├── calcomb.js         # Logic for combinations calculation
│   ├── calcestimado.js    # Logic for estimated calculation
│   └── doc.js             # Documentation interactivity
├── html/
│   ├── calcomb.html       # Combinations tool
│   ├── calcestimado.html  # Estimated calculation tool
│   └── doc.html           # Documentation/user guide
└── index.html             # Main menu
```

---

## 🔌 API Integration

While **NUVCalc** runs fully client-side, it can also integrate with a backend API for more advanced scenarios.

Deploy example:

```bash
scp target/calcnuv-api-0.0.1-SNAPSHOT.jar cgr@10.40.1.38:/var/www/java-api/
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 🗺️ Roadmap

* [ ] Add dark mode support
* [ ] Improve mobile responsiveness
* [ ] Export results to PDF/CSV
* [ ] Deploy demo version with GitHub Pages

---

## 📝 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Fernando Haeser**

* GitHub: [@FernandoHaeser](https://github.com/FernandoHaeser)
* LinkedIn: [linkedin.com/in/fehaeser](https://linkedin.com/in/fehaeser)
* Email: [fernandohaeserr@gmail.com](mailto:fernandohaeserr@gmail.com)

---

<p align="center">
    Made with ❤️ by Fernando Haeser
</p>

