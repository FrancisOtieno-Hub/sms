import { supabase } from "./supabase.js";

const feeForm = document.getElementById("feeForm");
const feeTableBody = document.querySelector("#feeTable tbody");
const studentSelect = document.getElementById("studentId");
const searchInput = document.getElementById("searchFee");
const filterStatus = document.getElementById("filterStatus");

const csvFeeFile = document.getElementById("csvFeeFile");
const uploadFeeBtn = document.getElementById("uploadFeeBtn");

// ================= Load Students for Dropdown =================
async function loadStudents() {
  const { data: students, error } = await supabase
    .from("students")
    .select("id, fullname, admission_no")
    .order("fullname", { ascending: true });

  if (error) return console.error(error);

  studentSelect.innerHTML = '<option value="">Select Student</option>' +
    students.map(s => `<option value="${s.id}">${s.fullname} (${s.admission_no})</option>`).join("");
}

// ================= Load Fees Table =================
async function loadFees() {
  const { data: fees, error } = await supabase
    .from("fees")
    .select("id, amount, term, paid_at, payment_method, status, receipt_no, comments, students(fullname, admission_no)")
    .order("paid_at", { ascending: false });

  if (error) return console.error(error);

  renderTable(fees);
}

// ================= Render Table with Filters =================
function renderTable(fees) {
  const filter = searchInput.value.toLowerCase();
  const statusFilter = filterStatus.value;

  const rows = fees
    .filter(f => 
      (f.students.fullname.toLowerCase().includes(filter) ||
       f.receipt_no?.toLowerCase().includes(filter) ||
       f.term.toLowerCase().includes(filter)) &&
      (!statusFilter || f.status === statusFilter)
    )
    .map(f => `
      <tr>
        <td data-label="Receipt">${f.receipt_no || ''}</td>
        <td data-label="Student">${f.students.fullname} (${f.students.admission_no})</td>
        <td data-label="Amount">KES ${f.amount}</td>
        <td data-label="Term">${f.term}</td>
        <td data-label="Payment Method">${f.payment_method}</td>
        <td data-label="Status">${f.status}</td>
        <td data-label="Paid At">${new Date(f.paid_at).toLocaleDateString()}</td>
        <td data-label="Comments">${f.comments || ''}</td>
        <td data-label="Actions">
          <button class="editBtn" data-id="${f.id}">Edit</button>
          <button class="deleteBtn" data-id="${f.id}">Delete</button>
        </td>
      </tr>
    `).join("");

  feeTableBody.innerHTML = rows;

  // Event Delegation for Edit/Delete
  feeTableBody.onclick = async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("editBtn")) editFee(id);
    if (e.target.classList.contains("deleteBtn")) deleteFee(id);
  };
}

// ================= Single Fee Submission =================
feeForm.onsubmit = async (e) => {
  e.preventDefault();

  const fee = {
    student_id: studentSelect.value,
    amount: parseFloat(document.getElementById("amount").value),
    term: document.getElementById("term").value.trim(),
    payment_method: document.getElementById("paymentMethod").value,
    status: document.getElementById("status").value,
    comments: document.getElementById("comments").value.trim()
  };

  if (!fee.student_id || !fee.amount || !fee.term || !fee.payment_method || !fee.status) {
    return alert("Please fill all required fields!");
  }

  const { error } = await supabase.from("fees").insert([fee]);
  if (error) return alert(error.message);

  feeForm.reset();
  loadFees();
};

// ================= Bulk Fee Upload =================
uploadFeeBtn.onclick = async () => {
  const file = csvFeeFile.files[0];
  if (!file) return alert("Select a CSV file!");

  const text = await file.text();
  const rows = text.split("\n").slice(1);
  const fees = [];

  for (const row of rows) {
    if (!row.trim()) continue;
    const [adm_no, amount, term, payment_method, status, comments] = row.split(",");

    // Get student_id from admission number
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("admission_no", adm_no.trim())
      .single();
    if (!student) continue;

    fees.push({
      student_id: student.id,
      amount: parseFloat(amount),
      term: term.trim(),
      payment_method: payment_method.trim() || "Cash",
      status: status.trim() || "Paid",
      comments: comments?.trim() || ""
    });
  }

  if (fees.length === 0) return alert("No valid rows found!");

  const { error } = await supabase.from("fees").insert(fees);
  if (error) return alert(error.message);

  alert(`${fees.length} fee records uploaded successfully!`);
  csvFeeFile.value = "";
  loadFees();
};

// ================= Edit Fee =================
async function editFee(id) {
  const { data } = await supabase.from("fees").select().eq("id", id).single();
  if (!data) return alert("Fee record not found!");

  const newAmount = prompt("Amount:", data.amount);
  const newTerm = prompt("Term:", data.term);
  const newStatus = prompt("Status:", data.status);
  const newPaymentMethod = prompt("Payment Method:", data.payment_method);
  const newComments = prompt("Comments:", data.comments || "");

  if (!newAmount || !newTerm || !newStatus || !newPaymentMethod) return;

  await supabase.from("fees").update({
    amount: parseFloat(newAmount),
    term: newTerm.trim(),
    status: newStatus.trim(),
    payment_method: newPaymentMethod.trim(),
    comments: newComments.trim()
  }).eq("id", id);

  loadFees();
}

// ================= Delete Fee =================
async function deleteFee(id) {
  if (!confirm("Delete this fee record?")) return;
  await supabase.from("fees").delete().eq("id", id);
  loadFees();
}

// ================= Filters =================
searchInput.oninput = loadFees;
filterStatus.onchange = loadFees;

// ================= Initial Load =================
loadStudents();
loadFees();
