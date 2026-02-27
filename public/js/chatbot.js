const chatbotCircle = document.getElementById("chatbot-circle");
const chatbotBox = document.getElementById("chatbot-box");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

// ================= OPEN / CLOSE =================
chatbotCircle.onclick = () => {
  chatbotBox.style.display = "flex";
};

closeChat.onclick = () => {
  chatbotBox.style.display = "none";
};

// ================= ENTER KEY =================
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

sendBtn.onclick = sendMessage;

// ================= SEND MESSAGE =================
function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user-message");
  processMessage(message);
  userInput.value = "";
}

// ================= ADD MESSAGE =================
function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ================= 3 DOT TYPING =================
function botReply(text) {
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing";
  typingDiv.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typingDiv.remove();

    const messageDiv = document.createElement("div");
    messageDiv.className = "bot-message";
    messageDiv.innerHTML = text;   // ✅ Insert full HTML properly

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 800);
}


// ================= MAIN LOGIC =================
function processMessage(message) {
  const lower = message.toLowerCase();

  // REGISTER NUMBER
  if (/^\d{6,}$/.test(message)) {
    botReply("Opening Student Login Page...");
    setTimeout(() => {
      window.location.href = "student-login.html?regno=" + message;
    }, 1200);
    return;
  }

  // ================= SMART HOD =================
  if (lower.includes("cse") && lower.includes("hod")) {
    return botReply("CSE HOD: MR. S. FRANKLIN | Phone: 9442576900 | Email: S.FRANKB@GMAIL.COM");
  }

  if (lower.includes("ece") && lower.includes("hod")) {
    return botReply("ECE HOD: MRS. F. HELEN BEULA | Phone: 9442760320 | Email: HELEN@GMAIL.COM");
  }

  if (lower.includes("mech") && lower.includes("hod")) {
    return botReply("MECH HOD: MR. REEGAN LAWRENCE | Phone: 7867037673 | Email: REEGAN@GMAIL.COM");
  }

  if (lower.includes("civil") && lower.includes("hod")) {
    return botReply("CIVIL HOD: MRS. T. JEMILA LOUISY MERLINE | Phone: 9894767327 | Email: JEMILA@GMAIL.COM");
  }

  if (lower.includes("eee") && lower.includes("hod")) {
    return botReply("EEE HOD: MR. M. PREM THADEUS | Phone: 9865488975 | Email: PREM@GMAIL.COM");
  }

  if (lower.includes("1year") && lower.includes("hod")) {
    return botReply("1st Year HOD: MR. M. EDWARD SINGH | Phone: 9942370138 | Email: EDWARD@GMAIL.COM");
  }

  if (lower.includes("hod")) {
    return botReply("HOD manages department activities. Type department name like 'CSE HOD' for contact details.");
  }

  // ================= PRINCIPAL =================
  if (lower.includes("principal")) {
    return botReply("Principal: Dr. BENHAM | Phone: 9998887776 | Email: BENHAM365@GMAIL.COM | Head of Institution.");
  }

  // ================= LEAVE SMART =================
  if (lower.includes("od")) {
    return botReply("OD Leave: For official academic activities. Requires HOD approval and valid proof.");
  }

  if (lower.includes("medical")) {
    return botReply("Medical Leave: Requires medical certificate and HOD approval.");
  }

  if (lower.includes("casual")) {
    return botReply("Casual Leave: 12 days per year. Prior approval required.");
  }

  if (lower.includes("leave")) {
    return botReply("Leave Types: OD Leave, Medical Leave, Casual Leave. Type specific leave for details.");
  }

  // ================= PLACEMENT =================
  if (lower.includes("placement") || lower.includes("job")) {
    return botReply("Placement Cell: 85% placement rate. Companies include NOKIA, APOLLO TYRES etc. Minimum 75% attendance required.");
  }

  // ================= ATTENDANCE =================
  if (lower.includes("attendance")) {
    return botReply("Minimum 75% attendance required. Below 75% → Not eligible for exams.");
  }

  // ================= FEES =================
  if (lower.includes("fee")) {
    return botReply("Annual Fee: ₹75,000. Installments allowed. Scholarship available.");
  }

  // ================= COMMITTEE CONTACT DETAILS =================

// Anti Ragging
if (lower.includes("anti ragging")) {
  return botReply(`
    <b>Anti Ragging Committee</b><br><br>
    Head: MR. <br>
    Phone: 9442576900<br>
    Email: antiragging@college.com<br><br>
    Purpose:<br>
    Prevent ragging activities and ensure student safety.
  `);
}

// Placement Committee
if (lower.includes("placement committee")) {
  return botReply(`
    <b>Placement Committee</b><br><br>
    Head: MRS. F. HELEN BEULA<br>
    Phone: 9442760320<br>
    Email: placement@college.com<br><br>
    Purpose:<br>
    Organizes campus interviews and job training.
  `);
}

// Cultural Committee
if (lower.includes("cultural committee")) {
  return botReply(`
    <b>Cultural Committee</b><br><br>
    Head: MR. REEGAN LAWRENCE<br>
    Phone: 7867037673<br>
    Email: cultural@college.com<br><br>
    Purpose:<br>
    Conducts college cultural events and programs.
  `);
}

// Women Protection Cell
if (lower.includes("women") || lower.includes("women protection")) {
  return botReply(`
    <b>Women Protection Cell</b><br><br>
    Head: MRS. T. JEMILA LOUISY MERLINE<br>
    Phone: 9894767327<br>
    Email: womenprotection@college.com<br><br>
    Purpose:<br>
    Ensures safety and rights of women students.
  `);
}

// General Committee List
if (lower.includes("committee")) {
  return botReply(`
    <b>College Committees</b><br><br>
    • Anti Ragging Committee<br>
    • Placement Committee<br>
    • Cultural Committee<br>
    • Women Protection Cell<br><br>
    👉 Type committee name for contact details.
  `);
}


  // ================= DEFAULT =================
  botReply("I am BAT AI 🤖. I Can Help With HOD, Principal, Leave, Placement, Attendance, Fees, Committee or enter Reg No.");
}
