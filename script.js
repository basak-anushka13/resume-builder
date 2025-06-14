let allSkills = [];

function safeValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.value.trim() : "";
}

function displaySkills() {
  const container = document.getElementById("skill-tags");
  container.innerHTML = "";
  allSkills.forEach((skill, index) => {
    const tag = document.createElement("div");
    tag.classList.add("skill-tag");
    tag.innerHTML = `${skill} <span class="remove-tag" onclick="removeSkill(${index})">&times;</span>`;
    container.appendChild(tag);
  });
}

function removeSkill(index) {
  allSkills.splice(index, 1);
  displaySkills();
}

// ========== DOM READY ==========
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resume-form");
  if (form) {
    form.addEventListener("submit", e => e.preventDefault());
  }

  const skillInput = document.getElementById("skill-input");
  if (skillInput) {
    skillInput.addEventListener("keydown", function (e) {
      if (e.key === "," || e.key === "Enter") {
        e.preventDefault();
        const input = e.target.value.trim().replace(/,$/, "");
        if (input && !allSkills.includes(input)) {
          allSkills.push(input);
          displaySkills();
        }
        e.target.value = "";
      }
    });
  }

  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", function (e) {
      e.preventDefault();
      generateResume();
    });
  }
});

// ========== DYNAMIC SECTION ADDERS ==========

function addEducation() {
  const section = document.getElementById("education-section");
  const entry = document.createElement("div");
  entry.classList.add("education-entry");
  entry.innerHTML = `
    <input type="text" name="degree[]" placeholder="Degree / Course Name">
    <input type="text" name="institution[]" placeholder="Institution Name">
    <input type="text" name="year[]" placeholder="Year of Passing">
    <input type="text" name="marks[]" placeholder="Marks / GPA">
    <hr>`;
  section.insertBefore(entry, section.lastElementChild);
}

function addSkill() {
  const section = document.getElementById("skills-section");
  const entry = document.createElement("div");
  entry.classList.add("skill-entry");
  entry.innerHTML = `<input type="text" name="skills[]" placeholder="Enter a skill">`;
  section.insertBefore(entry, section.lastElementChild);
}

function addProject() {
  const section = document.getElementById("projects-section");
  const entry = document.createElement("div");
  entry.classList.add("project-entry");
  entry.innerHTML = `
    <input type="text" name="project_name[]" placeholder="Project Name">
    <textarea name="project_desc[]" placeholder="Short Description"></textarea>
    <input type="url" name="project_link[]" placeholder="Project Link (optional)">`;
  section.insertBefore(entry, section.lastElementChild);
}

function addCertificate() {
  const section = document.getElementById("certificates-section");
  const entry = document.createElement("div");
  entry.classList.add("certificate-entry");
  entry.innerHTML = `
    <input type="text" name="certificate_title[]" placeholder="Certificate Title">
    <input type="text" name="certificate_org[]" placeholder="Issuing Organization">
    <input type="month" name="certificate_date[]">`;
  section.insertBefore(entry, section.lastElementChild);
}

function addExperience() {
  const section = document.getElementById("experience-section");
  const entry = document.createElement("div");
  entry.classList.add("experience-entry");
  entry.innerHTML = `
    <input type="text" name="job_title[]" placeholder="Job Title">
    <input type="text" name="company[]" placeholder="Company Name">
    <input type="text" name="duration[]" placeholder="Duration (e.g., Jan 2022 - Dec 2023)">
    <textarea name="job_description[]" placeholder="Job Description" rows="3"></textarea>`;
  section.insertBefore(entry, section.lastElementChild);
}

// ========== FINAL GENERATION ==========

function generateResume() {
  const education = Array.from(document.querySelectorAll(".education-entry")).map(entry => ({
    degree: entry.querySelector('[name="degree[]"]')?.value || "",
    institution: entry.querySelector('[name="institution[]"]')?.value || "",
    year: entry.querySelector('[name="year[]"]')?.value || "",
    marks: entry.querySelector('[name="marks[]"]')?.value || ""
  }));

  const skillInputs = document.querySelectorAll('input[name="skills[]"]');
  const skills = Array.from(skillInputs).map(input => input.value.trim()).filter(s => s);

  const projects = Array.from(document.querySelectorAll(".project-entry")).map(entry => ({
    name: entry.querySelector('[name="project_name[]"]')?.value || "",
    desc: entry.querySelector('[name="project_desc[]"]')?.value || "",
    link: entry.querySelector('[name="project_link[]"]')?.value || ""
  })).filter(p => p.name || p.desc || p.link);

  const certificates = Array.from(document.querySelectorAll(".certificate-entry")).map(entry => ({
    title: entry.querySelector('[name="certificate_title[]"]')?.value || "",
    org: entry.querySelector('[name="certificate_org[]"]')?.value || "",
    date: entry.querySelector('[name="certificate_date[]"]')?.value || ""
  }));

  const experience = Array.from(document.querySelectorAll(".experience-entry")).map(entry => ({
    title: entry.querySelector('[name="job_title[]"]')?.value || "",
    company: entry.querySelector('[name="company[]"]')?.value || "",
    duration: entry.querySelector('[name="duration[]"]')?.value || "",
    description: entry.querySelector('[name="job_description[]"]')?.value || ""
  }));

  const data = {
    name: safeValue('#name'),
    email: safeValue('#email'),
    phone: safeValue('#phone'),
    location: safeValue('#location'),
    linkedin: safeValue('#linkedin'),
    portfolio: safeValue('#portfolio'),
    description: safeValue('#description'),
    skills: [...skills, ...allSkills], // combine both types of skill input
    education,
    projects,
    certificates,
    experience
  };

  localStorage.setItem("resumeData", JSON.stringify(data));
  window.location.href = "https://basak-anushka13.github.io/resume-builder/preview.html";
}
