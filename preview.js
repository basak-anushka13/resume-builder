document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("resumeData"));
  if (!data) return;

  // Top details
  document.getElementById("name").textContent = data.name || "";
  document.getElementById("location").textContent = data.location || "";
  document.getElementById("description").textContent = data.description || "";

  // Contact links
  const contact = document.querySelector(".contact");
  contact.innerHTML = `
    ${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : ""}
    ${data.phone ? `⋄ ${data.phone}` : ""}
    ${data.linkedin ? `⋄ <a href="${data.linkedin}" target="_blank">LinkedIn</a>` : ""}
    ${data.portfolio ? `⋄ <a href="${data.portfolio}" target="_blank">Portfolio</a>` : ""}
  `;

  // Education
  const edu = document.getElementById("education-section");
  data.education?.forEach(eduEntry => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${eduEntry.degree}</strong> at ${eduEntry.institution} (${eduEntry.year})<br>Marks: ${eduEntry.marks}<br><br>`;
    edu.appendChild(div);
  });

  // Skills
  const skillsList = document.getElementById("skills-list");
  data.skills?.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    skillsList.appendChild(li);
  });

  // Projects
  const proj = document.getElementById("projects-section");
  data.projects?.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${p.name}</strong><br>
      ${p.desc}<br>
      ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ""}
      <br><br>
    `;
    proj.appendChild(div);
  });

  // Certificates
  const cert = document.getElementById("certificates-section");
  data.certificates?.forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${c.title}</strong> from ${c.org} (${c.date})<br><br>`;
    cert.appendChild(div);
  });

  // Experience
  const exp = document.getElementById("experience-section");
  data.experience?.forEach(e => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${e.title}</strong> at ${e.company} (${e.duration})<br>${e.description}<br><br>`;
    exp.appendChild(div);
  });

  // Profile Picture
  if (data.profilePic) {
    const img = document.createElement("img");
    img.src = data.profilePic;
    img.style.cssText = "position: absolute; top: 40px; right: 60px; width: 100px; height: 100px; border-radius: 50%; object-fit: cover;";
    document.querySelector(".resume").appendChild(img);
  }
});

function downloadPDF() {
  const element = document.getElementById("resume-content");
  html2pdf().from(element).save("Resume.pdf");
}
