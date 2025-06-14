function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function safeValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.value : "";
}

let allSkills = [];

// Prevent form submit
document.getElementById("resume-form").addEventListener("submit", e => e.preventDefault());

// Skills input
document.getElementById("skill-input").addEventListener("keydown", function (e) {
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

function previewProfilePic(input) {
  const file = input.files[0];
  const preview = document.getElementById("profilePicPreview");

  if (!file || !file.type.startsWith("image/")) {
    preview.src = "";
    preview.style.display = "none";
    return;
  }

  if (file.size > 1024 * 1024) {
    alert("Image must be under 1MB.");
    input.value = "";
    preview.src = "";
    preview.style.display = "none";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const maxSize = 200;
      let width = img.width, height = img.height;

      if (width > height && width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);

      preview.src = compressedDataUrl;
      preview.style.display = "block";
      window.compressedProfilePic = compressedDataUrl;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Dynamic add functions
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
  const section = document.getElementById('skills-section');
  const entry = document.createElement('div');
  entry.classList.add('skill-entry');
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

// Resume generation
document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) {
    generateBtn.addEventListener("click", async function (event) {
      event.preventDefault();
      await generateResume();
    });
  }
});

async function generateResume() {
  const educationEntries = document.querySelectorAll(".education-entry");
  const education = Array.from(educationEntries).map(entry => ({
    degree: entry.querySelector('[name="degree[]"]')?.value || "",
    institution: entry.querySelector('[name="institution[]"]')?.value || "",
    year: entry.querySelector('[name="year[]"]')?.value || "",
    marks: entry.querySelector('[name="marks[]"]')?.value || ""
  }));

  const projectEntries = document.querySelectorAll(".project-entry");
  const projects = Array.from(projectEntries).map(entry => ({
    name: entry.querySelector('[name="project_name[]"]')?.value || "",
    desc: entry.querySelector('[name="project_desc[]"]')?.value || "",
    link: entry.querySelector('[name="project_link[]"]')?.value || ""
  })).filter(p => p.name || p.desc || p.link);

  const certificateEntries = document.querySelectorAll(".certificate-entry");
  const certificates = Array.from(certificateEntries).map(entry => ({
    title: entry.querySelector('[name="certificate_title[]"]')?.value || "",
    org: entry.querySelector('[name="certificate_org[]"]')?.value || "",
    date: entry.querySelector('[name="certificate_date[]"]')?.value || ""
  }));

  const experienceEntries = document.querySelectorAll(".experience-entry");
  const experience = Array.from(experienceEntries).map(entry => ({
    title: entry.querySelector('[name="job_title[]"]')?.value || "",
    company: entry.querySelector('[name="company[]"]')?.value || "",
    duration: entry.querySelector('[name="duration[]"]')?.value || "",
    description: entry.querySelector('[name="job_description[]"]')?.value || ""
  }));

  const profilePic = window.compressedProfilePic || "";

  const data = {
    name: safeValue('#name'),
    email: safeValue('#email'),
    phone: safeValue('#phone'),
    location: safeValue('#location'),
    linkedin: safeValue('#linkedin'),
    portfolio: safeValue('#portfolio'),
    description: safeValue('#description'),
    skills: allSkills,
    education,
    projects,
    certificates,
    experience,
    profilePic
  };

  localStorage.setItem("resumeData", JSON.stringify(data));
  window.location.href = "preview.html";
}
