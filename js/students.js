import { supabase } from "./supabase.js";

const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");

form.onsubmit = async (e) => {
  e.preventDefault();

  // Get input values
  const nameValue = document.getElementById("name").value;
  const admValue = document.getElementById("adm").value;
  const classValue = document.getElementById("class").value; // use different variable name

  // Insert into Supabase
  const { error } = await supabase.from("students").insert({
    fullname: nameValue,
    admission_no: admValue,
    class: classValue
  });

  if (error) {
    alert(error.message);
  } else {
    form.reset();
    loadStudents();
  }
};

async function loadStudents() {
  const { data, error } = await supabase.from("students").select().order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  list.innerHTML = data.map(s =>
    `<li>${s.fullname} (${s.class})</li>`
  ).join("");
}

// Load students on page load
loadStudents();

