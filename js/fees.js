import { supabase } from "./supabase.js";

const feeForm = document.getElementById("feeForm");
const feeList = document.getElementById("feeList");
const studentSelect = document.getElementById("studentId");

// Load students into dropdown
async function loadStudents() {
  const { data: students, error } = await supabase
    .from("students")
    .select("id, fullname")
    .order("fullname", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  studentSelect.innerHTML = students
    .map(s => `<option value="${s.id}">${s.fullname}</option>`)
    .join("");
}

// Load fees history
async function loadFees() {
  const { data, error } = await supabase
    .from("fees")
    .select("amount, term, students(fullname)")
    .order("paid_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  feeList.innerHTML = data.map(f => `
    <li>
      <strong>${f.students.fullname}</strong><br>
      KES ${f.amount} – ${f.term}
    </li>
  `).join("");
}

// Handle fee form submission
feeForm.onsubmit = async (e) => {
  e.preventDefault();

  const studentId = studentSelect.value;
  const amount = document.getElementById("amount").value;
  const term = document.getElementById("term").value;

  if (!studentId || !amount || !term) {
    alert("Please fill all fields");
    return;
  }

  const { error } = await supabase.from("fees").insert({
    student_id: studentId,
    amount,
    term
  });

  if (error) {
    alert(error.message);
  } else {
    feeForm.reset();
    loadFees();
  }
};

// Initial load
loadStudents();
loadFees();
