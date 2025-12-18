import { supabase } from "./supabase.js";

const feeForm = document.getElementById("feeForm");
const feeList = document.getElementById("feeList");

feeForm.onsubmit = async (e) => {
  e.preventDefault();

  const studentId = document.getElementById("studentId").value;
  const amount = document.getElementById("amount").value;
  const term = document.getElementById("term").value;

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

async function loadFees() {
  const { data } = await supabase
    .from("fees")
    .select("amount, term, students(fullname)")
    .order("paid_at", { ascending: false });

  feeList.innerHTML = data.map(f => `
    <li>
      <strong>${f.students.fullname}</strong><br>
      KES ${f.amount} – ${f.term}
    </li>
  `).join("");
}

loadFees();
