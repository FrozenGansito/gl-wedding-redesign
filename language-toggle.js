// Language Toggle
// Author: Jose Sanchez

function setLanguage(lang) {
  localStorage.setItem("language", lang);

  document.querySelectorAll(".en").forEach(el => {
    el.style.display = (lang === "en") ? "inline" : "none";
  });

  document.querySelectorAll(".es").forEach(el => {
    el.style.display = (lang === "es") ? "inline" : "none";
  });

  // Highlight active button
  document.querySelectorAll(".language-toggle button").forEach(btn => {
    btn.classList.remove("active");
  });

  document.querySelector(`.language-toggle button[data-lang="${lang}"]`)
    ?.classList.add("active");
}


// Load saved language on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("language") || "en";
  setLanguage(savedLang);
});

