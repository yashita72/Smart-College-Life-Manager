// 🔥 Firebase Config (PASTE YOURS)
 const firebaseConfig = {
  apiKey: "AIzaSyBbIfj-m5ogJIraFmLUTZOTiRX9mXgsCXM",
  authDomain: "smart-cllg-life-manager.firebaseapp.com",
  projectId: "smart-cllg-life-manager",
  storageBucket: "smart-cllg-life-manager.firebasestorage.app",
  messagingSenderId: "451474230646",
  appId: "1:451474230646:web:1e1312d830c271ab46be57",
  measurementId: "G-30PE8MC3PW"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// AUTH
function signup() {
  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then(() => alert("Signup successful"))
    .catch(err => alert(err.message));
}

function login() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      document.getElementById("auth").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      loadTasks();
      setInterval(checkReminders, 60000);
    })
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut();
  location.reload();
}

// TASKS
function addTask() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push({
    title: task.value,
    type: type.value,
    deadline: deadline.value,
    priority: priority.value
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  task.value = "";
  deadline.value = "";
  loadTasks();
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function loadTasks() {
  const list = document.getElementById("tasks");
  list.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const now = new Date();

  tasks.forEach((t, i) => {
    const diffHours = (new Date(t.deadline) - now) / (1000 * 60 * 60);
    let tag = diffHours < 0 ? "❌ Overdue" : diffHours < 24 ? "⚠ Urgent" : "🕒 Upcoming";

    let li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${t.title}</strong> (${t.type})<br>
        <small>${t.deadline}</small><br>
        <small>${tag}</small>
      </div>
      <button class="delete-btn" onclick="deleteTask(${i})">❌</button>
    `;
    list.appendChild(li);
  });
}

// REMINDERS
function checkReminders() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const now = new Date();

  tasks.forEach(t => {
    const diffMin = (new Date(t.deadline) - now) / (1000 * 60);
    if (diffMin > 0 && diffMin < 30) {
      new Notification("⏰ Task Reminder", {
        body: `${t.title} is due soon`
      });
    }
  });
}

// GOOGLE CALENDAR (DEMO)
function openCalendar() {
  window.open("https://calendar.google.com", "_blank");
}
