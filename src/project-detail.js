import { PROJECTS } from "./projects-data.js";
import gsap from "gsap";

/**
 * Mengisi elemen DOM dengan data proyek.
 * @param {string} id - ID dari elemen.
 * @param {string} content - Konten untuk diisi.
 * @param {boolean} isHtml - Apakah konten berupa HTML.
 */
function populateElement(id, content, isHtml = false) {
  const element = document.getElementById(id);
  if (element) {
    if (isHtml) {
      element.innerHTML = content;
    } else {
      element.textContent = content;
    }
  }
}

/**
 * Membuat dan menambahkan daftar fitur proyek.
 * @param {string[]} features - Array fitur.
 */
function renderFeatures(features) {
  const featureList = document.getElementById("d-features");
  if (!featureList) return;
  featureList.innerHTML = ""; // Kosongkan dulu
  features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    featureList.appendChild(li);
  });
}

/**
 * Membuat dan menambahkan badge teknologi.
 * @param {string[]} tech - Array teknologi.
 */
function renderTechStack(tech) {
  const techWrap = document.getElementById("d-tech");
  if (!techWrap) return;
  techWrap.innerHTML = ""; // Kosongkan dulu
  tech.forEach((t) => {
    const span = document.createElement("span");
    span.className = "tech-badge";
    span.textContent = t;
    techWrap.appendChild(span);
  });
}

/**
 * Membuat dan menambahkan daftar proyek lainnya.
 * @param {string} currentProjectId - ID proyek saat ini.
 */
function renderOtherProjects(currentProjectId) {
  const othersWrap = document.getElementById("d-others");
  if (!othersWrap) return;
  othersWrap.innerHTML = ""; // Kosongkan dulu

  const otherProjects = PROJECTS.filter((p) => p.id !== currentProjectId);

  if (otherProjects.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Tidak ada proyek lain.";
    p.style.opacity = "0.7";
    othersWrap.appendChild(p);
    return;
  }

  otherProjects.forEach((p) => {
    const a = document.createElement("a");
    a.href = `project-detail.html?id=${p.id}`;
    a.className = "other-project-link";
    a.innerHTML = `
      <span class="other-project-title">${p.title}</span>
      <span class="other-project-role">${p.role}</span>
    `;
    othersWrap.appendChild(a);
  });
}

/**
 * Fungsi utama untuk menginisialisasi halaman detail proyek.
 */
// ... (biarkan fungsi populateElement, renderFeatures, dll di atasnya tetap sama)

function initProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  if (!projectId) {
    populateElement("d-title", "Proyek tidak ditemukan.");
    return;
  }

  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) {
    populateElement("d-title", "Proyek tidak ditemukan.");
    return;
  }

  document.title = `${project.title} — MHN.`;
  populateElement("d-role", project.role);
  populateElement("d-role2", project.role);
  populateElement("d-title", project.title);
  populateElement("d-desc", project.shortDesc);
  populateElement("d-year", project.year);
  populateElement("d-long", project.longDesc, true);

  // Load Image & Link jika ada
  const imgEl = document.getElementById("d-img");
  if (imgEl && project.image) imgEl.src = project.image;
  
  const btnGithub = document.getElementById("d-github");
  if (btnGithub && project.github) btnGithub.href = project.github;
  
  const btnDemo = document.getElementById("d-demo");
  if (btnDemo && project.demo) btnDemo.href = project.demo;

  renderFeatures(project.features);
  renderTechStack(project.tech);
  renderOtherProjects(project.id);

  // Animasi masuk (Ubah class dari .detail-container ke .detail-page)
  gsap.from(".detail-page", { opacity: 0, y: 30, duration: 1, ease: "power3.out", delay: 0.1 });
}

// PANGGIL FUNGSI SECARA LANGSUNG (Jangan pakai DOMContentLoaded)
initProjectDetail();