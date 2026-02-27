async function login() {

  const registerNo = document.getElementById("regno").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("errorMsg");

  if (!registerNo || !password) {
    errorBox.innerText = "Please enter register number and password";
    return;
  }

  try {

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registerNo, password })
    });

    const data = await res.json();

    if (data.student) {

      // Store full student object
      localStorage.setItem("student", JSON.stringify(data.student));

      console.log("Student Stored:", localStorage.getItem("student"));

      // Redirect safely
      window.location.replace("/student-dashboard.html");

    } else {
      errorBox.innerText = data.message || "Login failed";
    }

  } catch (err) {
    errorBox.innerText = "Server error";
  }
}
