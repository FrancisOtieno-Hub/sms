import { supabase } from "./supabase.js";

const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");

form.onsubmit = async (e) => {
  e.preventDefault();

  await supabase.from("students").insert({
    fullname: name.value,
    admission_no: adm.value,
    class: class.value
  });

  loadStudents();
};

async function loadStudents() {
  const { data } = await supabase.from("students").select();
  list.innerHTML = data.map(s =>
    `<li>${s.fullname} (${s.class})</li>`
  ).join("");
}

loadStudents();
