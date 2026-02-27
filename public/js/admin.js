let currentId = null;

// ================= ADD OR UPDATE =================
async function addStudent(){

const student={
registerNo: registerNo.value,
name: name.value,
mobile: mobile.value,
dob: dob.value,
department: department.value,
semester: semester.value,
attendance: attendance.value,
internal: internal.value,
marks: marks.value,
password: password.value
};

if(currentId){

  await fetch("/api/admin/update/"+currentId,{
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(student)
  });

  alert("Student Updated Successfully");
  currentId=null;

}else{

  await fetch("/api/admin/add-student",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(student)
  });

  alert("Student Added Successfully");
}

clearForm();
loadStudents();
}

// ================= SEARCH BY REGISTER NUMBER =================
async function searchStudent(){

const reg = document.getElementById("searchRegNo").value.trim();

if(!reg){
  alert("Enter Register Number");
  return;
}

const res = await fetch("/api/student/reg/"+reg);

if(res.status !== 200){
  alert("Student not found");
  return;
}

const s = await res.json();

registerNo.value=s.registerNo;
name.value=s.name;
mobile.value=s.mobile;
dob.value=s.dob;
department.value=s.department;
semester.value=s.semester;
attendance.value=s.attendance;
internal.value=s.internal;
marks.value=s.marks;

currentId=s._id;

alert("Student Loaded. Edit and click Save.");
}

// ================= LOAD STUDENTS =================
async function loadStudents(){

const res = await fetch("/api/student-list");
const students = await res.json();

let html="";

students.forEach(s=>{
html+=`
<tr>
<td>${s.name}</td>
<td>${s.registerNo}</td>
<td>
<button onclick="edit('${s._id}')">Edit</button>
<button onclick="del('${s._id}')">Delete</button>
</td>
</tr>`;
});

document.getElementById("studentTable").innerHTML=html;
}

// ================= EDIT FROM TABLE =================
async function edit(id){

const res = await fetch("/api/student/"+id);
const s = await res.json();

registerNo.value=s.registerNo;
name.value=s.name;
mobile.value=s.mobile;
dob.value=s.dob;
department.value=s.department;
semester.value=s.semester;
attendance.value=s.attendance;
internal.value=s.internal;
marks.value=s.marks;

currentId=id;
}

// ================= DELETE =================
async function del(id){

if(!confirm("Are you sure to delete?")) return;

await fetch("/api/admin/delete/"+id,{method:"DELETE"});
loadStudents();
}

// ================= CLEAR FORM =================
function clearForm(){
registerNo.value="";
name.value="";
mobile.value="";
dob.value="";
department.value="";
semester.value="";
attendance.value="";
internal.value="";
marks.value="";
password.value="";
}

// ================= INITIAL LOAD =================
loadStudents();
