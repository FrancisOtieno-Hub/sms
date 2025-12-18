import { supabase } from "./supabase.js";

const form = document.getElementById("studentForm");
const tableBody = document.querySelector("#studentTable tbody");
const searchInput = document.getElementById("searchStudent");

// Add student
form.onsubmit = async (e) => {
  e.preventDefault();
  const nameValue = document.getElementById("name").value;
  const admValue = document.getElementById("adm").value;
  const classValue = document.getElementById("class").value;

  const { error } = await supabase.from("students").insert({
    fullname: nameValue,
    admission_no: admValue,
    class: classValue
  });

  if (error) return alert(error.message);

  form.reset();
  loadStudents();
};

// Load students into table
async function loadStudents() {
  const { data, error } = await supabase
    .from("students")
    .select()
    .order("created_at", { ascending: false });

  if (error) return console.error(error);

  renderTable(data);
}

// Render table with search filter
function renderTable(students) {
  const filter = searchInput.value.toLowerCase();
  const rows = students
    .filter(s => 
      s.fullname.toLowerCase().includes(filter) || 
      s.admission_no.toLowerCase().includes(filter)
    )
    .map(s => `
      <tr>
        <td>${s.fullname}</td>
        <td>${s.admission_no}</td>
        <td>${s.class}</td>
        <td>
          <button class="editBtn" data-id="${s.id}">Edit</button>
          <button class="deleteBtn" data-id="${s.id}">Delete</button>
        </td>
      </tr>
    `).join("");
  tableBody.innerHTML = rows;

  // Add event listeners
  document.querySelectorAll(".editBtn").forEach(btn =>
    btn.onclick = () => editStudent(btn.dataset.id)
  );
  document.querySelectorAll(".deleteBtn").forEach(btn =>
    btn.onclick = () => deleteStudent(btn.dataset.id)
  );
}

// Edit student
async function editStudent(id) {
  const { data } = await supabase.from("students").select().eq("id", id).single();
  const newName = prompt("Full Name:", data.fullname);
  const newAdm = prompt("Admission No:", data.admission_no);
  const newClass = prompt("Class:", data.class);
  if (!newName || !newAdm || !newClass) return;

  await supabase.from("students").update({
    fullname: newName,
    admission_no: newAdm,
    class: newClass
  }).eq("id", id);

  loadStudents();
}

// Delete student
async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  await supabase.from("students").delete().eq("id", id);
  loadStudents();
}

// Search filter
searchInput.oninput = loadStudents;

// Initial load
loadStudents();
