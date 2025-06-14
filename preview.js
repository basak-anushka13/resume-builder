document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("resumeData"));
  if (!data) return;

  // Rebuild header with name and location
  const resume = document.querySelector(".resume");
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  `;

  const left = document.createElement("div");
  left.innerHTML = `
    <h1 style="margin: 0;">${data.name}</h1>
    <div class="contact" style="color:#555; font-size:14px; margin-top: 4px;">
      ${data.location || ""}
    </div>
  `;
  header.appendChild(left);

  // Remove old name block
  const oldName = document.getElementById("name");
  if (oldName) oldName.parentElement.removeChild(oldName);
  resume.insertBefore(header, resume.firstChild);

  // Description
  document.getElementById("description").textContent = data.description || "";

  // Contact section
  const contact = document.querySelector(".contact");
  contact.innerHTML += `
    ${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : ""}
    ${data.phone ? ` ⋄ ${data.phone}` : ""}
    ${data.linkedin ? ` ⋄ <a href="${data.linkedin}" target="_blank">LinkedIn</a>` : ""}
    ${data.portfolio ? ` ⋄ <a href="${data.portfolio}" target="_blank">Portfolio</a>` : ""}
  `;

  // Section filler
  const fillSection = (id, items, formatter) => {
    const container = document.getElementById(id);
    if (!container || !items) return;
    container.innerHTML = ""; // Clear previous if any
    items.forEach(entry => {
      const div = document.createElement("div");
      div.innerHTML = formatter(entry);
      container.appendChild(div);
    });
  };

  // Populate all sections
  fillSection("education-section", data.education, e =>
    `<strong>${e.degree}</strong> at ${e.institution} (${e.year})<br>Marks: ${e.marks}<br><br>`
  );

  fillSection("skills-list", data.skills, s => `<li>${s}</li>`);

  fillSection("projects-section", data.projects, p =>
    `<strong>${p.name}</strong><br>${p.desc}<br>${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ""}<br><br>`
  );

  fillSection("certificates-section", data.certificates, c =>
    `<strong>${c.title}</strong> from ${c.org} (${c.date})<br><br>`
  );

  fillSection("experience-section", data.experience, e =>
    `<strong>${e.title}</strong> at ${e.company} (${e.duration})<br>${e.description}<br><br>`
  );
});

// ✅ FINAL working PDF download (with optional image support)
function downloadPDF() {
  const element = document.getElementById("resume-content");
  setTimeout(() => {
    html2pdf().from(element).set({
      margin: 0.5,
      filename: 'My_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: window.devicePixelRatio > 1 ? 2 : 1,
        useCORS: true
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
  }, 800);
}
html2canvas: {
  scale: 1,
  useCORS: true
}
