document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("resumeData"));
  if (!data) return;

  // Header
  document.getElementById("name").textContent = data.name || "";
document.getElementById("location").textContent = data.location || "";
document.getElementById("description").textContent = data.description || "";
if (data.profilePic) {
  const pic = document.getElementById("profile-pic");
  pic.src = data.profilePic;
  pic.style.display = "inline-block";
}

// Email
if (data.email) {
  const emailEl = document.getElementById("email");
  emailEl.textContent = data.email;
  emailEl.href = "mailto:" + data.email;
}

// Phone
if (data.phone) {
  const phoneEl = document.getElementById("phone");
  phoneEl.textContent = data.phone;
  phoneEl.href = "tel:" + data.phone.replace(/\s+/g, '');
}

// LinkedIn
if (data.linkedin) {
  const linkedinEl = document.getElementById("linkedin");
  linkedinEl.textContent = "LinkedIn";
  linkedinEl.href = data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin;
}

// Portfolio
if (data.portfolio) {
  const portfolioEl = document.getElementById("portfolio");
  portfolioEl.textContent = "Portfolio";
  portfolioEl.href = data.portfolio.startsWith("http") ? data.portfolio : "https://" + data.portfolio;
}

  // Education
  const edu = document.getElementById("education-section");
  data.education.forEach(e => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${e.degree}</strong> at ${e.institution} (${e.year})<br>Marks: ${e.marks}<br><br>`;
    edu.appendChild(div);
  });

  // Skills
  const skillsList = document.getElementById("skills-list");
  data.skills.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    skillsList.appendChild(li);
  });

  // Projects
 const proj = document.getElementById("projects-section");

data.projects
  .filter(p => p.name || p.desc || p.link) // ✅ only keep filled projects
  .forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${p.name}</strong><br>
      ${p.desc}<br>
      ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ""}
      <br><br>
    `;
    proj.appendChild(div);
  });

if (proj.children.length === 0) {
  document.getElementById("projects-container").style.display = "none"; // ✅ hide whole section if no entries
}

  // Certificates
  const cert = document.getElementById("certificates-section");
  data.certificates.forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${c.title}</strong> from ${c.org} (${c.date})<br><br>`;
    cert.appendChild(div);
  });

  // Experience
  const exp = document.getElementById("experience-section");
  data.experience.forEach(e => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${e.title}</strong> at ${e.company}<br>${e.duration}<br>${e.description}<br><br>`;
    exp.appendChild(div);
  });
});

function downloadPDF() {
  const element = document.getElementById("resume-content");
  html2pdf().from(element).save("Resume.pdf");
}
