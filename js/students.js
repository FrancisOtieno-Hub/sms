import { supabase } from "./supabase.js";

const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");
const searchInput = document.getElementById("searchStudent");

const csvFileInput = document.getElementById("csvFile");
const uploadBtn = document.getElementById("uploadBtn");

// ================= Single Registration =================
form.onsubmit = async (e) => {
  e.preventDefault();

  const student = {
    fullname: document.getElementById("fullname").value.trim(),
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    class_level: document.getElementById("class_level").value,
    parent_name: document.getElementById("parent_name").value.trim(),
    parent_contact: document.getElementById("parent_contact").value.trim(),
  };

  // Validate
  if (Object.values(student).some(v => !v)) return alert("Fill all fields!");

  const { error } = await supabase.from("students").insert([student]);
  if (error) return alert(error.message);

  form.reset();
  loadStudents();
};

// ================= Bulk Registration =================
uploadBtn.onclick = async () => {
  const file = csvFileInput.files[0];
  if (!file) return alert("Please select a CSV file!");

  const text = await file.text();
  const rows = text.split("\n").slice(1); // skip header
  const students = [];

  for (const row of rows) {
    if (!row.trim()) continue;
    const [fullname, dob, gender, class_level, parent_name, parent_contact] = row.split(",");
    students.push({ fullname, dob, gender, class_level, parent_name, parent_contact });
  }

  if (students.length === 0) return alert("No valid rows found!");

  const { error } = await supabase.from("students").insert(students);
  if (error) return alert(error.message);

  alert(`${students.length} students registered successfully!`);
  csvFileInput.value = "";
  loadStudents();
};

// ================= Load & Render Students =================
async function loadStudents() {
  const { data, error } = await supabase
    .from("students")
    .select()
    .order("admitted_at", { ascending: false });

  if (error) return console.error(error);

  renderTable(data);
}

function renderTable(students) {
  const filter = searchInput.value.toLowerCase();
  const rows = students
    .filter(s =>
      s.fullname.toLowerCase().includes(filter) ||
      s.admission_no.toLowerCase().includes(filter) ||
      s.class_level.toLowerCase().includes(filter)
    )
    .map(s => `
      <tr>
        <td data-label="Admission No">${s.admission_no}</td>
        <td data-label="Full Name">${s.fullname}</td>
        <td data-label="DOB">${s.dob}</td>
        <td data-label="Gender">${s.gender}</td>
        <td data-label="Class">${s.class_level}</td>
        <td data-label="Parent">${s.parent_name}</td>
        <td data-label="Contact">${s.parent_contact}</td>
        <td data-label="Actions">
          <button class="editBtn" data-id="${s.id}">Edit</button>
          <button class="deleteBtn" data-id="${s.id}">Delete</button>
        </td>
      </tr>
    `).join("");
  tableBody.innerHTML = rows;

  // Event Delegation for Edit/Delete
  tableBody.onclick = async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("editBtn")) {
      await editStudent(id);
    } else if (e.target.classList.contains("deleteBtn")) {
      await deleteStudent(id);
    }
  };
}

// ================= Edit & Delete =================
async function editStudent(id) {
  const { data } = await supabase.from("students").select().eq("id", id).single();
  if (!data) return alert("Student not found!");

  const newName = prompt("Full Name:", data.fullname);
  const newClass = prompt("Class Level:", data.class_level);
  if (!newName || !newClass) return;

  await supabase.from("students").update({
    fullname: newName,
    class_level: newClass
  }).eq("id", id);

  loadStudents();
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  await supabase.from("students").delete().eq("id", id);
  loadStudents();
}

// ================= Search Filter =================
let debounce;
searchInput.oninput = () => {
  clearTimeout(debounce);
  debounce = setTimeout(loadStudents, 300);
};

// ================= Initial Load =================
loadStudents();
