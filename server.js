import nodemailer from "nodemailer";


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// ===== FIX __dirname =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONNECT MONGODB =====
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log("❌ MongoDB Error:", err));

// ===== SCHEMA =====
const studentSchema = new mongoose.Schema({
  registerNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: String,
  dob: String,
  department: String,
  semester: Number,
  attendance: Number,
  internal: Number,
  marks: Number,
  password: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
app.post("/send-mail", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iambatman06092000@gmail.com",   // Your Gmail
        pass: "sync innu pudo mopj"     // Paste 16-digit app password here
      }
    });

    await transporter.sendMail({
      from: email,
      to: "iambatman06092000@gmail.com",
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Message from Website</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    res.json({ message: "Mail sent successfully!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending mail" });
  }
});

// ================= LOGIN =================
app.post("/api/login", async (req,res)=>{
  try {
    const { registerNo, password } = req.body;

    const student = await Student.findOne({ registerNo });
    if(!student) return res.status(400).json({message:"Student not found"});

    const valid = await bcrypt.compare(password, student.password);
    if(!valid) return res.status(400).json({message:"Wrong password"});

    res.json({ student });

  } catch(error){
    res.status(500).json({message:"Server error"});
  }
});

// ================= ADD STUDENT =================
app.post("/api/admin/add-student", async (req,res)=>{
  try {

    const existing = await Student.findOne({ registerNo: req.body.registerNo });
    if(existing){
      return res.status(400).json({message:"Register number already exists"});
    }

    const hashedPassword = await bcrypt.hash(req.body.password,10);

    const student = new Student({
      registerNo: req.body.registerNo,
      name: req.body.name,
      mobile: req.body.mobile,
      dob: req.body.dob,
      department: req.body.department,
      semester: req.body.semester,
      attendance: req.body.attendance,
      internal: req.body.internal,
      marks: req.body.marks,
      password: hashedPassword
    });

    await student.save();
    res.json({message:"Student Added Successfully"});

  } catch(error){
    res.status(500).json({message:error.message});
  }
});

// ================= UPDATE STUDENT =================
app.put("/api/admin/update/:id", async (req,res)=>{
  try {

    const data = req.body;

    if(data.password){
      data.password = await bcrypt.hash(data.password,10);
    }

    await Student.findByIdAndUpdate(req.params.id, data);
    res.json({message:"Student Updated Successfully"});

  } catch(error){
    res.status(500).json({message:error.message});
  }
});

// ================= DELETE STUDENT =================
app.delete("/api/admin/delete/:id", async (req,res)=>{
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({message:"Student Deleted Successfully"});
  } catch(error){
    res.status(500).json({message:error.message});
  }
});

// ================= GET ALL STUDENTS =================
async function searchStudent(){

  const reg = document.getElementById("searchRegNo").value.trim();

  if(!reg){
    alert("Enter Register Number");
    return;
  }

  try{

    const res = await fetch("/api/student/reg/"+reg);

    if(!res.ok){
      alert("Student not found");
      return;
    }

    const s = await res.json();

    document.getElementById("registerNo").value = s.registerNo;
    document.getElementById("name").value = s.name;
    document.getElementById("mobile").value = s.mobile;
    document.getElementById("dob").value = s.dob;
    document.getElementById("department").value = s.department;
    document.getElementById("semester").value = s.semester;
    document.getElementById("attendance").value = s.attendance;
    document.getElementById("internal").value = s.internal;
    document.getElementById("marks").value = s.marks;

    currentId = s._id;

    alert("Student Loaded Successfully");

  }catch(err){
    alert("Server error");
  }
}


// ================= GET STUDENT BY ID =================
app.get("/api/student/:id", async (req,res)=>{
  try {
    const student = await Student.findById(req.params.id);
    if(!student) return res.status(404).json({message:"Not found"});
    res.json(student);
  } catch(error){
    res.status(500).json({message:error.message});
  }
});

// ================= GET STUDENT BY REGISTER NO =================
app.get("/api/student/reg/:regNo", async (req,res)=>{
  try {
    const reg = req.params.regNo.trim();

    const student = await Student.findOne({
      registerNo: { $regex: new RegExp("^" + reg + "$", "i") }
    });

    if(!student) return res.status(404).json({message:"Not found"});
    res.json(student);

  } catch(error){
    res.status(500).json({message:error.message});
  }
});


// ================= SERVE FRONTEND =================
app.use(express.static(path.join(__dirname,"public")));

// ================= START SERVER =================
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});