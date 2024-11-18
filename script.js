// Variables
const form = document.getElementById("settings-form");
const remindersList = document.getElementById("reminders-list");
const habitProgress = document.getElementById("habit-progress");

// Función para guardar y mostrar los recordatorios
function saveReminders(event) {
  event.preventDefault();

  const hydrationTime = document.getElementById("hydration-time").value;
  const activityTime = document.getElementById("activity-time").value;
  const restTime = document.getElementById("rest-time").value;
  const stressTime = document.getElementById("stress-time").value;

  // Crear un objeto con los recordatorios
  const reminders = [
    { name: "Hidratación", time: hydrationTime },
    { name: "Actividad Física", time: activityTime },
    { name: "Descanso", time: restTime },
    { name: "Manejo de Estrés", time: stressTime }
  ];

  // Mostrar los recordatorios en la lista
  remindersList.innerHTML = '';
  reminders.forEach(reminder => {
    const li = document.createElement("li");
    li.textContent = `${reminder.name} - ${reminder.time}`;
    remindersList.appendChild(li);
  });

  // Guardar progreso
  saveProgress();
}

// Función para guardar el progreso de los hábitos
function saveProgress() {
  const progressData = [
    { habit: "Hidratación", progress: 0.75 },
    { habit: "Actividad Física", progress: 0.60 },
    { habit: "Descanso", progress: 0.80 },
    { habit: "Manejo de Estrés", progress: 0.50 }
  ];

  habitProgress.innerHTML = '';
  progressData.forEach(data => {
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.style.width = "100%";

    const span = document.createElement("span");
    span.style.width = `${data.progress * 100}%`;

    progressBar.appendChild(span);
    const habitText = document.createElement("p");
    habitText.textContent = `${data.habit}: ${Math.round(data.progress * 100)}%`;

    habitProgress.appendChild(habitText);
    habitProgress.appendChild(progressBar);
  });
}

// Escuchar el evento de enviar el formulario
form.addEventListener("submit", saveReminders);

// Inicializar progreso al cargar la página
saveProgress();
