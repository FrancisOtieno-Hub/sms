import { supabase } from "./supabase.js";

const feeForm = document.getElementById("feeForm");
const feeTableBody = document.querySelector("#feeTable tbody");
const studentSelect = document.getElementById("studentId");
const searchInput = document.getElementById("searchFee");

// Load students into dropdown
async function loadStudents() {
  const { data: students, error } = await supabase
    .from("students")
    .select("id, fullname")
    .order("fullname", { ascending: true });

  if (error) return console.error(error);

  studentSelect.innerHTML = students
    .map(s => `<option value="${s.id}">${s.fullname}</option>`)
    .join("");
}

// Load fees table
async function loadFees() {
  const { data, error } = await supabase
    .from("fees")
    .select("id, amount, term, paid_at, students(fullname)")
    .order("paid_at", { ascending: false });

  if (error) return console.error(error);

  renderTable(data);
}

// Render table with search filter
function renderTable(fees) {
  const filter = searchInput.value.toLowerCase();
  const rows = fees
    .filter(f => 
      f.students.fullname.toLowerCase().includes(filter) ||
      f.term.toLowerCase().includes(filter)
    )
    .map(f => `
      <tr>
        <td>${f.students.fullname}</td>
        <td>KES ${f.amount}</td>
        <td>${f.term}</td>
        <td>${new Date(f.paid_at).toLocaleDateString()}</td>
        <td>
          <button class="editBtn" data-id="${f.id}">Edit</button>
          <button class="deleteBtn" data-id="${f.id}">Delete</button>
        </td>
      </tr>
    `).join("");
  feeTableBody.innerHTML = rows;

  // Add event listeners
  document.querySelectorAll(".editBtn").forEach(btn =>
    btn.onclick = () => editFee(btn.dataset.id)
  );
  document.querySelectorAll(".deleteBtn").forEach(btn =>
    btn.onclick = () => deleteFee(btn.dataset.id)
  );
}

// Add new fee
feeForm.onsubmit = async (e) => {
  e.preventDefault();

  const studentId = studentSelect.value;
  const amount = document.getElementById("amount").value;
  const term = document.getElementById("term").value;

  if (!studentId || !amount || !term) return alert("Fill all fields");

  const { error } = await supabase.from("fees").insert({
    student_id: studentId,
    amount,
    term
  });

  if (error) return alert(error.message);

  feeForm.reset();
  loadFees();
};

// Edit fee
async function editFee(id) {
  const { data } = await supabase.from("fees").select().eq("id", id).single();
  const newAmount = prompt("Amount:", data.amount);
  const newTerm = prompt("Term:", data.term);
  if (!newAmount || !newTerm) return;

  await supabase.from("fees").update({
    amount: newAmount,
    term: newTerm
  }).eq("id", id);

  loadFees();
}

// Delete fee
async function deleteFee(id) {
  if (!confirm("Delete this payment?")) return;
  await supabase.from("fees").delete().eq("id", id);
  loadFees();
}

// Search input
searchInput.oninput = loadFees;

// Initial load
loadStudents();
loadFees();
