function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper to safely get input values
function safeValue(selector) {
  const el = document.querySelector(selector);
  return el ? el.value : "";
}

let allSkills = [];

// Prevent form from submitting normally
document.getElementById("resume-form").addEventListener("submit", function (e) {
  e.preventDefault();
});

// Handle skill tags
function addSkill() {
  const section = document.getElementById('skills-section');
  const entry = document.createElement('div');
  entry.classList.add('skills-entry');
  entry.innerHTML = `<input type="text" name="skills[]" placeholder="Skill">`;
  section.insertBefore(entry, section.lastElementChild); // Before button
}

function displaySkills() {
  const container = document.getElementById('skill-tags');
  container.innerHTML = '';
  allSkills.forEach((skill, index) => {
    const tag = document.createElement('div');
    tag.classList.add('skill-tag');
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

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

// Dynamic Section Adders (without file inputs)
function addEducation() {
  const section = document.getElementById('education-section');
  const entry = document.createElement('div');
  entry.classList.add('education-entry');
  entry.innerHTML = `
    <input type="text" name="degree[]" placeholder="Degree / Course Name">
    <input type="text" name="institution[]" placeholder="Institution Name">
    <input type="text" name="year[]" placeholder="Year of Passing">
    <input type="text" name="marks[]" placeholder="Marks / GPA">
    <hr>
  `;
  section.insertBefore(entry, section.lastElementChild);
}
function addProject() {
  const section = document.getElementById('projects-section');
  const entry = document.createElement('div');
  entry.classList.add('project-entry');
  entry.innerHTML = `
    <input type="text" name="project_name[]" placeholder="Project Name">
    <textarea name="project_desc[]" placeholder="Short Description"></textarea>
    <input type="url" name="project_link[]" placeholder="Project Link (optional)">
  `;
  section.insertBefore(entry, section.lastElementChild);
}

function addCertificate() {
  const section = document.getElementById('certificates-section');
  const entry = document.createElement('div');
  entry.classList.add('certificate-entry');
  entry.innerHTML = `
    <input type="text" name="certificate_title[]" placeholder="Certificate Title">
    <input type="text" name="certificate_org[]" placeholder="Issuing Organization">
    <input type="month" name="certificate_date[]">
  `;
  section.insertBefore(entry, section.lastElementChild);
}

function addExperience() {
  const section = document.getElementById('experience-section');
  const entry = document.createElement('div');
  entry.classList.add('experience-entry');
  entry.innerHTML = `
    <input type="text" name="job_title[]" placeholder="Job Title">
    <input type="text" name="company[]" placeholder="Company Name">
    <input type="text" name="duration[]" placeholder="Duration (e.g., Jan 2022 - Dec 2023)">
    <textarea name="job_description[]" placeholder="Job Description" rows="3"></textarea>
  `;
  section.insertBefore(entry, section.lastElementChild);
}

// Main resume generation
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
const skillInputs = document.querySelectorAll('[name="skills[]"]');
const skills = Array.from(skillInputs).map(input => input.value.trim()).filter(Boolean);

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

  let profilePic = "";
  const picInput = document.getElementById("profilePic");
  if (picInput?.files?.[0]) {
    profilePic = await readFileAsDataURL(picInput.files[0]);
  }

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
