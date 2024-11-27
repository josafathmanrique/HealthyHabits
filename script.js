// === Inicialización de EmailJS ===
emailjs.init('21plkRpze1kjwsSCX'); // Cambia este ID por el tuyo si es necesario

// === Gestión de Recordatorios ===
document.getElementById("reminder-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const habit = document.getElementById("habit").value.trim();
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const frequency = document.getElementById("frequency").value;
    const timezone = document.getElementById("timezone").value;
    const email = document.getElementById("email").value.trim();
    console.log("Correo electrónico ingresado:", email);

    // Validar campos obligatorios
    if (!habit || !startDate || !endDate || !startTime) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
    }

    // Crear recordatorio
    const reminder = {
        habit,
        startDate,
        endDate,
        startTime,
        endTime,
        frequency,
        timezone,
        email,
    };

    console.log("Recordatorio guardado:", reminder);
    alert("Recordatorio guardado exitosamente.");

    // Programar envío de correo electrónico
    const sendReminder = () => {
        const templateParams = {
            habit: reminder.habit,
            frequency: reminder.frequency,
            email: reminder.email, // Este debe contener el correo ingresado
        };

        emailjs
            .send("default_service", "template_bmac3rf", templateParams)
            .then(() => {
                console.log("Correo enviado exitosamente.");
            })
            .catch((error) => {
                console.error("Error al enviar el correo:", error);
            });
    };

    // Lógica adicional para recordatorios...
});

// === Temporizador de Tareas ===
window.startTimer = function() {
    const minutes = parseInt(document.getElementById("timer-minutes").value, 10);

    // Validación de entrada
    if (!minutes || minutes <= 0) {
        alert("Por favor, introduce un número válido de minutos.");
        return;
    }

    let seconds = minutes * 60;
    const display = document.getElementById("timer-display");

    // Configuración del intervalo para actualizar cada segundo
    const interval = setInterval(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        // Actualización del temporizador en pantalla
        display.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

        if (seconds <= 0) {
            clearInterval(interval);
            alert("¡Tiempo terminado!");
        }

        seconds--;
    }, 1000);
};


// === NÚMEROS DE EMERGENCIA ===
const emergencyDataURL = 'https://josafathmanrique.github.io/HealthyHabits/emergency-numbers.json';
let emergencyNumbers = {};

async function loadEmergencyNumbers() {
    try {
        const response = await fetch('emergency-numbers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        emergencyNumbers = await response.json();
        populateCityDropdown();
    } catch (error) {
        console.error("Error al cargar los números de emergencia:", error);
        alert("No se pudieron cargar los números de emergencia. Por favor, inténtalo más tarde.");
    }
}

function populateCityDropdown() {
    const dropdown = document.getElementById('cityDropdown');
    dropdown.innerHTML = ''; // Limpia las opciones anteriores

    // Itera sobre el objeto "emergencies" y toma las claves (que son las ciudades)
    for (const city in emergencyNumbers.emergencies[0]) {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
    }
}

function showEmergencyNumbers(cityName) {
    const numbersList = document.getElementById('numbersList');
    numbersList.innerHTML = '';

    // Busca la ciudad seleccionada en el JSON y muestra los números de emergencia
    for (const city of emergencyNumbers.emergencies) {
        if (city[cityName]) {
            city[cityName].forEach(number => {
                const li = document.createElement('li');
                li.textContent = `${number.name}: ${number.phone}`;
                numbersList.appendChild(li);
            });
            break;
        }
    }
}


    directoryDiv.innerHTML =
        `<h4>Directorio de ${city}</h4><ul>` +
        Object.entries(directory)
            .map(([key, value]) => {
                // Si es un número telefónico, crea un enlace
                if (!isNaN(value.replace(/\D/g, ""))) { // Verifica si es un número
                    return `<li><strong>${key}:</strong> <a href="tel:${value}" class="phone-link">${value}</a></li>`;
                }
                // Si no es un número, simplemente muestra el texto
                return `<li><strong>${key}:</strong> ${value}</li>`;
            })
            .join("") +
        `</ul>`;

}

// === Gestión de Temas ===
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("selected-theme", theme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem("selected-theme") || "light";
    applyTheme(savedTheme);
    const themeSelector = document.getElementById("theme");
    if (themeSelector) themeSelector.value = savedTheme;
}

loadSavedTheme();

// === Gestión de Medicamentos ===
function saveMedication() {
    const name = document.getElementById("medication-name").value.trim();
    const dose = document.getElementById("medication-dose").value.trim();
    const time = document.getElementById("medication-time").value.trim();

    if (!name || !dose || !time) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const medications = JSON.parse(localStorage.getItem("medications")) || [];
    medications.push({ name, dose, time });
    localStorage.setItem("medications", JSON.stringify(medications));
    renderMedications();
}

function renderMedications() {
    const medications = JSON.parse(localStorage.getItem("medications")) || [];
    const list = document.getElementById("medication-list");
    list.innerHTML = medications
        .map(
            (med) =>
                `<li>${med.name} - ${med.dose} - ${med.time} <button onclick="removeMedication('${med.name}')">Eliminar</button></li>`
        )
        .join("");
}

function removeMedication(name) {
    const medications = JSON.parse(localStorage.getItem("medications")) || [];
    const updatedMedications = medications.filter((med) => med.name !== name);
    localStorage.setItem("medications", JSON.stringify(updatedMedications));
    renderMedications();
}
// === Gestión de Citas Médicas con Notificaciones (1 Día Antes) ===
document.getElementById("save-appointment-button").addEventListener("click", function (event) {
    event.preventDefault();

    // Obtener los datos del formulario
    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;
    const doctor = document.getElementById("appointment-doctor").value.trim();
    const email = document.getElementById("appointment-email").value.trim();

    // Validar campos obligatorios
    if (!date || !time || !doctor || !email) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear objeto para almacenar la cita
    const appointment = { date, time, doctor, email };

    // Guardar la cita en LocalStorage
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments.push(appointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Cita médica guardada exitosamente.");

    // Programar el envío de notificación por correo
    const sendAppointmentReminder = () => {
        const templateParams = {
            date: appointment.date,
            time: appointment.time,
            doctor: appointment.doctor,
            email: appointment.email // Correo del destinatario
        };

        // Usar el template de EmailJS para enviar la notificación
        emailjs.send("default_service", "template_ujmr34p", templateParams)
            .then(() => {
                console.log("Notificación enviada exitosamente.");
                alert("Notificación enviada exitosamente al correo.");
            })
            .catch((error) => {
                console.error("Error al enviar la notificación:", error);
                alert("Error al enviar la notificación. Por favor, verifica los datos.");
            });
    };

    // Calcular el tiempo hasta 1 día antes de la cita
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000); // 1 día antes
    const now = new Date();

    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder > 0) {
        setTimeout(() => {
            sendAppointmentReminder();
        }, timeUntilReminder);
    } else {
        console.error("La cita ya pasó o la hora es inválida para un recordatorio 1 día antes.");
    }

    renderAppointments();
});

// === Seguimiento de Salud ===
window.saveHealthMetric = function saveHealthMetric() {
    const metric = document.getElementById("health-metric").value.trim();
    const value = document.getElementById("health-value").value.trim();

    // Validar campos obligatorios
    if (!metric || !value) {
        alert("Por favor, completa ambos campos.");
        return;
    }

    // Guardar en LocalStorage
    const healthMetrics = JSON.parse(localStorage.getItem("healthMetrics")) || [];
    healthMetrics.push({ metric, value });
    localStorage.setItem("healthMetrics", JSON.stringify(healthMetrics));

    // Renderizar la lista actualizada
    renderHealthMetrics();

    alert("Métrica de salud guardada exitosamente.");
};

function renderHealthMetrics() {
    const healthMetrics = JSON.parse(localStorage.getItem("healthMetrics")) || [];
    const list = document.getElementById("health-metrics-list");
    list.innerHTML = healthMetrics
        .map(
            (item, index) =>
                `<li>${item.metric}: ${item.value} <button onclick="removeHealthMetric(${index})">Eliminar</button></li>`
        )
        .join("");
}

window.removeHealthMetric = function removeHealthMetric(index) {
    const healthMetrics = JSON.parse(localStorage.getItem("healthMetrics")) || [];
    healthMetrics.splice(index, 1);
    localStorage.setItem("healthMetrics", JSON.stringify(healthMetrics));
    renderHealthMetrics();
};

// Llamar a renderHealthMetrics al cargar la página
renderHealthMetrics();


// === Renderizar las Citas Guardadas ===
function renderAppointments() {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const list = document.getElementById("appointment-list");
    list.innerHTML = appointments
        .map(
            (appt) =>
                `<li>${appt.date} - ${appt.time} con ${appt.doctor} <button onclick="removeAppointment('${appt.date}')">Eliminar</button></li>`
        )
        .join("");
}

function removeAppointment(date) {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const updatedAppointments = appointments.filter((appt) => appt.date !== date);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    renderAppointments();
}

// Renderizar citas al cargar la página
renderAppointments();

// === Lista de Compras ===
function addShoppingItem() {
    const item = document.getElementById("shopping-item").value.trim();
    if (!item) return;

    const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    shoppingList.push(item);
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    renderShoppingList();
}

function renderShoppingList() {
    const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    const list = document.getElementById("shopping-list");
    list.innerHTML = shoppingList
        .map(
            (item, index) =>
                `<li>${item} <button onclick="removeShoppingItem(${index})">Eliminar</button></li>`
        )
        .join("");
}

function removeShoppingItem(index) {
    const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    shoppingList.splice(index, 1);
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    renderShoppingList();
}
// === Generar Imagen con html2canvas ===
document.getElementById("generate-image-button").addEventListener("click", () => {
    const content = document.body;

    html2canvas(content).then((canvas) => {
        const link = document.createElement("a");
        link.download = "healthyhabits-info.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }).catch((error) => {
        console.error("Error al generar la imagen:", error);
        alert("Hubo un error al generar la imagen.");
    });
});


// === Inicialización ===
function initializeApp() {
    loadEmergencyNumbers();
    loadSavedTheme();
    renderMedications();
    renderShoppingList();
    console.log("Aplicación inicializada.");
}

window.onload = initializeApp;
