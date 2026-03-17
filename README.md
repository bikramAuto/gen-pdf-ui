<div align="center">
  <img src="public/markdown.svg" width="80" height="80" alt="genPdf Logo" />
  <h1>genPdf</h1>
  <p><strong>A modern, professional Markdown Editor with Template Persistence</strong></p>
  <p>
    <a href="https://desktop-markdown-editor.web.app">Live Demo</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#technical-overview">Technical Overview</a>
  </p>
</div>

---

genPdf is a high-fidelity Markdown writing environment designed for professional document creation. It combines the power of VS Code's editor engine with a pixel-perfect physical page layout system, allowing you to save your favorite document configurations as cloud-synced templates.

## Key Features

- **Template Persistence (Cloud Sync)**:
  - **Save & Load**: Save your entire workspace—content, layout, theme, and PDF configurations—to your account.
  - **Smart Syncing**: Use one-click "Save" to update existing templates or "Save Template" to create new versions.
  - **Instant Recovery**: Restore your exact document state (including font settings, margins, and banners) from any device.
- **User Authentication**:
  - Secure account creation and login system.
  - Personalized profile menu to manage your saved templates and session.
- **Real-time WYSIWYG Preview**: GitHub-flavored Markdown rendering as you type with automatic syntax highlighting.
- **Physical Page Management**: 
  - **Auto-Pagination**: Automatically splits long content into A4, Letter, or Legal pages.
  - **Manual Breaks**: Insert precision page breaks to force content onto new pages.
  - **Pixel-Perfect Scaling**: The preview pane perfectly reflects the physical dimensions and margins of your export.
- **Advanced PDF Export**:
  - Customizable header/footer text with automated page numbering.
  - Visual timestamps for document versioning.
  - Custom HTML banners for repeatable branded headers and footers.
- **Smart Image Handling**:
  - **Local Persistence**: Images are compressed and stored securely in IndexedDB.
  - **Performance Optimized**: Tiny Markdown file sizes (images referenced by hash, not Base64).
  - **Automated Cleanup**: Intelligently purges unused images to optimize local storage.

## Technical Overview

Built for speed and reliability using a state-of-the-art tech stack:

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18 + TypeScript |
| **Editor** | Monaco Editor Engine |
| **Auth & API** | JWT-based Authentication |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Rendering** | marked.js + highlight.js |
| **Security** | DOMPurify Sanitization |
| **Database** | IndexedDB (Images) + REST API (Templates) |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
