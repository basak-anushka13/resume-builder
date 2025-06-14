document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("resumeData"));
  if (!data) return;

  // Set basic info
  document.getElementById("name").textContent = data.name || "";
  document.getElementById("location").textContent = data.location || "";
  document.getElementById("description").textContent = data.description || "";

  // Contact links
  const contact = document.querySelector(".contact");
  contact.innerHTML = `
    ${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : ""}
    ${data.phone ? ` ⋄ ${data.phone}` : ""}
    ${data.linkedin ? ` ⋄ <a href="${data.linkedin}" target="_blank">LinkedIn</a>` : ""}
    ${data.portfolio ? ` ⋄ <a href="${data.portfolio}" target="_blank">Portfolio</a>` : ""}
  `;

  // Clear previous entries
  document.getElementById("education-section").innerHTML = "";
  document.getElementById("skills-list").innerHTML = "";
  document.getElementById("projects-section").innerHTML = "";
  document.getElementById("certificates-section").innerHTML = "";
  document.getElementById("experience-section").innerHTML = "";

  // Education
  data.education?.forEach(edu => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${edu.degree}</strong> at ${edu.institution} (${edu.year})<br>Marks: ${edu.marks}<br><br>`;
    document.getElementById("education-section").appendChild(div);
  });

  // Skills
  data.skills?.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    document.getElementById("skills-list").appendChild(li);
  });

  // Projects
  data.projects?.forEach(p => {
    if (p.name || p.desc || p.link) {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${p.name}</strong><br>
        ${p.desc}<br>
        ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ""}
        <br><br>
      `;
      document.getElementById("projects-section").appendChild(div);
    }
  });

  // Certificates
  data.certificates?.forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${c.title}</strong> from ${c.org} (${c.date})<br><br>`;
    document.getElementById("certificates-section").appendChild(div);
  });

  // Experience
  data.experience?.forEach(e => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${e.title}</strong> at ${e.company} (${e.duration})<br>${e.description}<br><br>`;
    document.getElementById("experience-section").appendChild(div);
  });

  // Profile Pic
  if (data.profilePic) {
    const img = document.createElement("img");
    img.src = data.profilePic;
  img.style.cssText = `
  float: right;
  margin: 0 0 10px 20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;
    document.querySelector(".resume").appendChild(img);
  }
});

// ✅ Final working PDF generator
function downloadPDF() {
  const element = document.getElementById("resume-content");
  setTimeout(() => {
    html2pdf().from(element).set({
      margin: 0.5,
      filename: "My_Resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    }).save();
  }, 300); // short delay ensures everything loads
}
