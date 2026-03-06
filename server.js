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



// ================= CONTACT MAIL =================
app.post("/send-mail", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Message</h2>
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
      ...req.body,
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
app.get("/api/student-list", async (req,res)=>{
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch(error){
    res.status(500).json({message:error.message});
  }
});



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
    const student = await Student.findOne({
      registerNo: req.params.regNo
    });

    if(!student) return res.status(404).json({message:"Not found"});
    res.json(student);

  } catch(error){
    res.status(500).json({message:error.message});
  }
});



// ================= SERVE FRONTEND =================
app.use(express.static(path.join(__dirname,"public")));



// ================= FALLBACK ROUTE =================
app.get("*", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});



// ================= START SERVER =================
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running");
});