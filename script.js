"use strict";

document.querySelectorAll(".service-photo[data-fallback]").forEach((image) => {
  image.addEventListener("error", () => {
    image.onerror = null;
    image.src = image.dataset.fallback;
  }, { once: true });
});

const STORAGE_KEY = "teoAutomotriz.requests.v1";
const SESSION_KEY = "teoAutomotriz.session.v1";
const USERS_KEY = "teoAutomotriz.users.v1";
const DEMO_USERS = [
  { id: "demo-client-1", name: "Luis Llumiquinga", email: "cliente@teoautomotriz.com", password: "cliente123", role: "cliente", active: true },
  { id: "demo-client-2", name: "Ana Gómez", email: "ana@teoautomotriz.com", password: "ana123", role: "cliente", active: true },
  { id: "admin", name: "Administrador", email: "admin@teoautomotriz.com", password: "admin123", role: "admin", active: true }
];
const USERS = loadUsers();
const STATUSES = ["Pendiente", "En revisión", "En proceso", "Finalizado", "Cancelado"];
let requests = loadRequests();
let currentUser = loadSession();
let registering = false;
const demoClient = USERS.find((user) => user.email === "cliente@teoautomotriz.com");
if (demoClient) {
  requests.forEach((request) => {
    if (request.email === demoClient.email) request.customerName = demoClient.name;
  });
}

const $ = (id) => document.getElementById(id);
const form = $("requestForm");
const loginForm = $("loginForm");
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
$("requestedDate").min = localToday;
$("year").max = String(new Date().getFullYear() + 1);
const MODEL_OPTIONS = {
  Acura: ["ILX", "Integra", "MDX", "RDX", "TLX"], "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"], Audi: ["A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "Q8"],
  BMW: ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "X1", "X3", "X5", "X6", "X7"], BYD: ["Dolphin", "Han", "Seagull", "Song Plus", "Tang", "Yuan Plus"],
  Changan: ["CS15", "CS35 Plus", "CS55 Plus", "CS75 Plus", "UNI-T"], Chery: ["Arrizo 5", "Tiggo 2", "Tiggo 4", "Tiggo 7", "Tiggo 8"], Chevrolet: ["Aveo", "Beat", "Camaro", "Captiva", "D-Max", "Equinox", "Onix", "Sail", "Spark", "Tracker", "Trailblazer"],
  Citroën: ["Berlingo", "C3", "C4", "C5 Aircross"], Dodge: ["Attitude", "Challenger", "Journey", "RAM 700"], Fiat: ["500", "Argo", "Cronos", "Mobi", "Pulse", "Strada"], Ford: ["Bronco", "EcoSport", "Escape", "Edge", "Explorer", "F-150", "Fiesta", "Focus", "Ranger", "Territory"],
  Honda: ["Accord", "City", "Civic", "CR-V", "HR-V", "Pilot"], Hyundai: ["Accent", "Creta", "Elantra", "Kona", "Santa Fe", "Tucson"], JAC: ["E10X", "JS2", "JS4", "JS6", "T8"], Jeep: ["Cherokee", "Compass", "Grand Cherokee", "Renegade", "Wrangler"],
  Kia: ["Cerato", "K3", "Niro", "Picanto", "Rio", "Seltos", "Sonet", "Sportage"], Mazda: ["CX-3", "CX-30", "CX-5", "CX-50", "Mazda 2", "Mazda 3", "Mazda 6"], "Mercedes-Benz": ["Clase A", "Clase C", "Clase E", "GLA", "GLB", "GLC", "GLE", "GLS"], MG: ["3", "5", "ZS", "HS", "RX5"], Mitsubishi: ["ASX", "Eclipse Cross", "L200", "Montero Sport", "Outlander"], Nissan: ["Frontier", "Kicks", "March", "Pathfinder", "Sentra", "Versa", "X-Trail"],
  Peugeot: ["2008", "208", "3008", "301", "5008", "Partner"], Renault: ["Arkana", "Duster", "Kardian", "Koleos", "Logan", "Sandero", "Stepway"], Subaru: ["Crosstrek", "Forester", "Impreza", "Outback", "XV"], Suzuki: ["Alto", "Baleno", "Jimny", "Swift", "Vitara"], Tesla: ["Model 3", "Model S", "Model X", "Model Y"], Toyota: ["4Runner", "Corolla", "Fortuner", "Hilux", "Land Cruiser", "Prado", "RAV4", "Yaris"], Volkswagen: ["Amarok", "Golf", "Jetta", "Nivus", "Polo", "T-Cross", "Tiguan", "Virtus"], Volvo: ["C40", "S60", "XC40", "XC60", "XC90"]
};
function updateModelOptions() {
  const options = MODEL_OPTIONS[$("brand").value] || [];
  $("modelOptions").innerHTML = options.map((model) => `<option value="${safeText(model)}"></option>`).join("");
}
updateModelOptions();

function loadRequests() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function loadUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (!Array.isArray(users)) return [...DEMO_USERS];
    const mergedUsers = [...DEMO_USERS.filter((demoUser) => !users.some((user) => user.email === demoUser.email)), ...users];
    return mergedUsers.map((user) => user.email === "cliente@teoautomotriz.com"
      ? { ...user, name: "Luis Llumiquinga" }
      : user);
  } catch { return [...DEMO_USERS]; }
}
function saveUsers() { localStorage.setItem(USERS_KEY, JSON.stringify(USERS)); }
function saveRequests() { localStorage.setItem(STORAGE_KEY, JSON.stringify(requests)); }
function loadSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    return USERS.find((user) => user.id === session?.id && user.active !== false) || null;
  } catch { return null; }
}
function saveSession() {
  if (currentUser) sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: currentUser.id }));
  else sessionStorage.removeItem(SESSION_KEY);
}
function alertMessage(icon, title, text = "") {
  return Swal.fire({ icon, title, text, confirmButtonColor: "#c62828" });
}
function showScreen(name) {
  document.querySelectorAll("[data-screen]").forEach((section) => {
    section.classList.toggle("d-none", section.dataset.screen !== name);
  });
  if (name === "home" && location.hash !== "#inicio") history.replaceState(null, "", "#inicio");
  else if (name !== "home") history.replaceState(null, "", `#${name === "login" ? "acceso" : name === "request" ? "solicitud" : "panel"}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function getFormData() {
  return {
    customerName: $("clientName").value.trim(),
    email: $("clientEmail").value.trim().toLowerCase(),
    phone: $("clientPhone").value.trim(),
    plate: $("plate").value.trim().toUpperCase(),
    brand: $("brand").value.trim(),
    model: $("model").value.trim(),
    year: Number($("year").value),
    mileage: Number($("mileage").value),
    service: $("service").value,
    date: $("requestedDate").value,
    time: $("requestedTime").value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || "Prefiero no decirlo",
    modality: document.querySelector('input[name="modality"]:checked')?.value || "",
    diagnostic: $("diagnosticConsent").checked,
    notes: $("notes").value.trim()
  };
}
function validateForm(data) {
  const plateInput = $("plate");
  plateInput.value = plateInput.value.toUpperCase();
  const invalid = form.querySelector(":invalid");
  if (invalid) {
    const reasons = {
      clientName: "Escribe tu nombre completo (mínimo 3 caracteres).", clientEmail: "Escribe un correo electrónico válido.", clientPhone: "El teléfono debe tener exactamente 10 dígitos.",
      plate: "La placa debe tener 3 letras, un guion y 4 números.", brand: "Selecciona una marca de la lista.", model: "Escribe o selecciona el modelo del vehículo.",
      year: `El año debe estar entre 1950 y ${new Date().getFullYear() + 1}.`, mileage: "El kilometraje debe estar entre 0 y 999.999 km.", service: "Selecciona el tipo de servicio.", requestedDate: "Selecciona una fecha para la solicitud.", requestedTime: "Selecciona una hora.", contactConsent: "Debes aceptar que el taller te contacte."
    };
    const reason = invalid.id === "requestedDate" && invalid.validity.rangeUnderflow
      ? "La fecha solicitada no puede ser anterior a hoy."
      : invalid.id === "year" && invalid.validity.rangeOverflow
        ? `El año no puede ser posterior a ${new Date().getFullYear() + 1}.`
        : invalid.id === "mileage" && invalid.validity.rangeOverflow
          ? "El máximo permitido es 999.999 km."
          : reasons[invalid.id] || invalid.validationMessage || "Completa correctamente este campo.";
    alertMessage("error", "Revisa este dato", reason);
    invalid.focus();
    return false;
  }
  const isNewRequest = !$("editId").value;
  if (isNewRequest && data.date < localToday) { alertMessage("error", "Fecha no válida", "La fecha solicitada no puede ser anterior a hoy."); $("requestedDate").focus(); return false; }
  if (isNewRequest && data.date === localToday && data.time) {
    const [hours, minutes] = data.time.split(":").map(Number);
    const requestedMinutes = hours * 60 + minutes;
    const now = new Date();
    if (requestedMinutes <= now.getHours() * 60 + now.getMinutes()) {
      alertMessage("error", "Hora no válida", "Para una solicitud de hoy, elige una hora posterior a la actual.");
      $("requestedTime").focus();
      return false;
    }
  }
  if (data.year < 1950 || data.year > new Date().getFullYear() + 1) { alertMessage("error", "Año no válido", `Ingresa un año entre 1950 y ${new Date().getFullYear() + 1}.`); $("year").focus(); return false; }
  if (data.mileage < 0 || data.mileage > 999999) { alertMessage("error", "Kilometraje no válido", "Ingresa un valor entre 0 y 999.999 km."); $("mileage").focus(); return false; }
  return true;
}
function resetRequestForm() {
  form.reset();
  $("editId").value = "";
  const clientAccount = currentUser && !canManage();
  $("clientName").value = clientAccount ? currentUser.name : "";
  $("clientEmail").value = clientAccount ? currentUser.email : "";
  $("clientName").readOnly = Boolean(clientAccount);
  $("clientEmail").readOnly = Boolean(clientAccount);
  $("submitRequest").textContent = "Registrar solicitud";
  $("cancelEdit").classList.add("d-none");
  $("requestedDate").min = localToday;
}
function canManage() { return currentUser?.role === "admin"; }
function handleRequestSubmit(event) {
  event.preventDefault();
  const data = getFormData();
  if (currentUser && !canManage()) {
    data.customerName = currentUser.name;
    data.email = currentUser.email;
    $("clientName").value = currentUser.name;
    $("clientEmail").value = currentUser.email;
  }
  if (!validateForm(data)) return;
  const editId = $("editId").value;
  if (editId && !currentUser) { alertMessage("info", "Inicia sesión", "Inicia sesión para editar una solicitud."); return; }
  if (editId && canManage()) {
    const existing = requests.find((request) => request.id === editId);
    if (!existing) { alertMessage("error", "No encontrada", "La solicitud ya no existe."); return; }
    Object.assign(existing, data, { updatedAt: new Date().toISOString() });
    alertMessage("success", "Solicitud actualizada", "Los cambios fueron guardados.");
  } else {
    if (!currentUser) { alertMessage("info", "Inicia sesión", "Inicia sesión antes de registrar una solicitud."); return; }
    requests.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), userId: canManage() ? "admin-created" : currentUser.id, status: "Pendiente", createdAt: new Date().toISOString(), ...data });
    alertMessage("success", "Solicitud registrada", "Tu solicitud quedó en estado Pendiente.");
  }
  saveRequests(); resetRequestForm(); renderPanel(); showScreen("dashboard");
}
function handleLogin(event) {
  event.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const password = $("loginPassword").value;
  if (registering) {
    const name = $("registerName").value.trim();
    if (name.length < 3) { alertMessage("error", "Nombre incompleto", "Escribe tu nombre completo (mínimo 3 caracteres)."); $("registerName").focus(); return; }
    if (USERS.some((item) => item.email === email)) { alertMessage("error", "Correo ya registrado", "Prueba iniciar sesión con ese correo o usa otro."); $("loginEmail").focus(); return; }
    const user = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name, email, password, role: "cliente" };
    USERS.push(user);
    saveUsers();
    currentUser = user; saveSession(); loginForm.reset();
    renderPanel(); showScreen("dashboard");
    alertMessage("success", `¡Bienvenido, ${user.name}!`, "Tu cuenta está lista.");
    return;
  }
  const user = USERS.find((item) => item.email === email && item.password === password);
  if (!user) { alertMessage("error", "Acceso no válido", "Revisa el correo y la contraseña."); return; }
  if (user.active === false) { alertMessage("error", "Cuenta deshabilitada", "Comunícate con el administrador del taller para recibir ayuda."); return; }
  currentUser = user; saveSession(); loginForm.reset();
  renderPanel();
  showScreen("dashboard");
  alertMessage("success", `Bienvenido, ${user.name}`, user.role === "admin" ? "Ingresaste como administrador." : "Ingresaste como cliente.");
}
function setAuthMode(createAccount) {
  registering = createAccount;
  $("registerNameGroup").classList.toggle("d-none", !createAccount);
  $("registerName").required = createAccount;
  $("registerName").value = "";
  $("authTitle").textContent = createAccount ? "Crear mi cuenta" : "Iniciar sesión";
  $("authDescription").textContent = createAccount
    ? "Regístrate con tus datos para guardar tus solicitudes en este navegador."
    : "Entra para consultar y organizar los mantenimientos de tu vehículo.";
  $("authSubmit").textContent = createAccount ? "Crear cuenta" : "Entrar";
  $("authSwitchText").textContent = createAccount ? "¿Ya tienes cuenta?" : "¿Primera vez aquí?";
  $("authSwitch").textContent = createAccount ? "Iniciar sesión" : "Crear cuenta";
  $("loginPassword").autocomplete = createAccount ? "new-password" : "current-password";
  loginForm.reset();
}
async function logout() {
  const confirmation = await Swal.fire({
    icon: "question",
    title: "¿Estás seguro de cerrar sesión?",
    text: "Tendrás que volver a iniciar sesión para entrar a tu área personal.",
    showCancelButton: true,
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Seguir en mi cuenta",
    confirmButtonColor: "#c62828"
  });
  if (!confirmation.isConfirmed) return;
  currentUser = null; saveSession(); resetRequestForm(); renderPanel();
  showScreen("home");
  alertMessage("success", "Sesión cerrada");
}
function renderPanel() {
  const panel = $("panel");
  $("logoutBtn").classList.toggle("d-none", !currentUser);
  $("loginNav").textContent = currentUser ? "Mi panel" : "Iniciar sesión";
  $("loginNav").href = currentUser ? "#panel" : "#acceso";
  $("loginNav").dataset.screenLink = currentUser ? "dashboard" : "login";
  $("heroCta").textContent = currentUser ? "Ir a mi panel" : "Iniciar sesión o crear cuenta";
  $("heroCta").href = currentUser ? "#panel" : "#acceso";
  $("heroCta").dataset.screenLink = currentUser ? "dashboard" : "login";
  if (!currentUser) { panel.classList.add("d-none"); return; }
  panel.classList.remove("d-none");
  const admin = canManage();
  $("panelTitle").textContent = admin ? "Administración de mantenimientos" : "Mis mantenimientos";
  $("welcomeText").textContent = `Bienvenido, ${currentUser.name}. ${admin ? "Puedes gestionar todas las solicitudes." : "Aquí puedes consultar tus solicitudes."}`;
  $("roleBadge").textContent = admin ? "Administrador" : "Cliente";
  $("profileName").textContent = currentUser.name;
  $("profileEmail").textContent = currentUser.email;
  $("profileRole").textContent = admin ? "Administrador" : "Cliente";
  $("actionsHeading").textContent = admin ? "Acciones" : "Estado";
  const visibleRequests = admin ? requests : requests.filter((request) => request.userId === currentUser.id);
  const tbody = $("requestRows");
  tbody.innerHTML = "";
  visibleRequests.forEach((request) => {
    const tr = document.createElement("tr");
    const statusOptions = STATUSES.map((status) => `<option${status === request.status ? " selected" : ""}>${safeText(status)}</option>`).join("");
    const delivery = request.deliveryDate && request.deliveryTime
      ? `${safeText(request.deliveryDate)}<br><strong>${safeText(request.deliveryTime)}</strong>`
      : request.status === "Finalizado" ? "<span class=\"text-secondary\">Pendiente de definir</span>" : "<span class=\"text-secondary\">Por confirmar</span>";
    const actions = admin
      ? `<div class="d-flex flex-column gap-2"><select class="form-select form-select-sm status-select" aria-label="Estado" data-status="${safeText(request.id)}">${statusOptions}</select><div class="d-flex gap-2"><button class="btn btn-sm btn-outline-primary" data-edit="${safeText(request.id)}">Editar</button><button class="btn btn-sm btn-outline-danger" data-delete="${safeText(request.id)}">Eliminar</button></div></div>`
      : `<span class="badge ${request.status === "Finalizado" ? "text-bg-success" : request.status === "Cancelado" ? "text-bg-secondary" : "text-bg-warning"}">${safeText(request.status)}</span>`;
    tr.innerHTML = `<td>${safeText(request.customerName)}<br><small class="text-secondary">${safeText(request.email)}</small></td><td>${safeText(request.brand)} ${safeText(request.model)}<br><small class="text-secondary">${safeText(request.plate)} · ${safeText(request.year)}</small></td><td>${safeText(request.service)}</td><td>${safeText(request.date)}<br>${safeText(request.time)}</td><td>${delivery}</td><td>${actions}</td>`;
    tbody.appendChild(tr);
  });
  $("emptyMessage").classList.toggle("d-none", visibleRequests.length > 0);
  if (visibleRequests.length === 0) tbody.innerHTML = "";
}
function beginEdit(id) {
  if (!canManage()) { alertMessage("error", "Acceso restringido", "Solo el administrador puede editar solicitudes."); return; }
  const request = requests.find((item) => item.id === id);
  if (!request) return;
  $("editId").value = request.id;
  $("clientName").value = request.customerName;
  $("clientEmail").value = request.email;
  $("clientPhone").value = request.phone;
  $("plate").value = request.plate;
  $("brand").value = request.brand;
  updateModelOptions();
  $("model").value = request.model;
  $("year").value = request.year;
  $("mileage").value = request.mileage;
  $("service").value = request.service;
  $("requestedDate").value = request.date;
  $("requestedDate").min = request.date < localToday ? request.date : localToday;
  $("requestedTime").value = request.time;
  $("notes").value = request.notes || "";
  $("diagnosticConsent").checked = Boolean(request.diagnostic);
  document.querySelector(`input[name="gender"][value="${CSS.escape(request.gender)}"]`)?.click();
  document.querySelector(`input[name="modality"][value="${CSS.escape(request.modality)}"]`)?.click();
  $("submitRequest").textContent = "Guardar cambios";
  $("cancelEdit").classList.remove("d-none");
  showScreen("request");
}
async function deleteRequest(id) {
  if (!canManage()) { alertMessage("error", "Acceso restringido", "Solo el administrador puede eliminar solicitudes."); return; }
  const result = await Swal.fire({ icon: "warning", title: "¿Eliminar solicitud?", text: "Esta acción quitará el registro de este navegador.", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#c62828" });
  if (!result.isConfirmed) return;
  requests = requests.filter((request) => request.id !== id);
  saveRequests(); renderPanel();
}
async function changeStatus(id, status) {
  if (!canManage()) { alertMessage("error", "Acceso restringido", "Solo el administrador puede cambiar estados."); renderPanel(); return; }
  const request = requests.find((item) => item.id === id);
  if (!request || !STATUSES.includes(status)) return;
  if (status === "Finalizado") {
    const serviceDay = new Date(`${request.date}T12:00:00`);
    const todayDate = new Date(`${localToday}T12:00:00`);
    const serviceIsFuture = serviceDay > todayDate;
    const windowStart = serviceIsFuture ? serviceDay : todayDate;
    const earliestDate = new Date(windowStart);
    if (serviceIsFuture) earliestDate.setDate(earliestDate.getDate() + 1);
    const toLocalDateString = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const earliestDelivery = toLocalDateString(earliestDate);
    const result = await Swal.fire({
      icon: "question",
      title: "Programar entrega del vehículo",
      text: "El cliente verá el día y la hora que indiques.",
      html: `<label class="d-block text-start mb-2" for="deliveryDateInput">Día de entrega</label><input id="deliveryDateInput" class="swal2-input" type="date" min="${earliestDelivery}" required><label class="d-block text-start mb-2" for="deliveryTimeInput">Hora de entrega</label><input id="deliveryTimeInput" class="swal2-input" type="time" required>`,
      showCancelButton: true,
      confirmButtonText: "Guardar y finalizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c62828",
      focusConfirm: false,
      preConfirm: () => {
        const deliveryDate = $("deliveryDateInput").value;
        const deliveryTime = $("deliveryTimeInput").value;
        if (!deliveryDate || deliveryDate < earliestDelivery || deliveryDate <= request.date) { Swal.showValidationMessage("Elige una fecha posterior al ingreso del vehículo. No se permiten fechas pasadas ni el mismo día."); return false; }
        if (!deliveryTime) { Swal.showValidationMessage("Indica la hora de entrega."); return false; }
        return { deliveryDate, deliveryTime };
      }
    });
    if (!result.isConfirmed) { renderPanel(); return; }
    request.deliveryDate = result.value.deliveryDate;
    request.deliveryTime = result.value.deliveryTime;
  } else {
    request.deliveryDate = "";
    request.deliveryTime = "";
  }
  request.status = status;
  request.updatedAt = new Date().toISOString();
  saveRequests();
  renderPanel();
  if (status === "Finalizado") alertMessage("success", "Entrega programada", "El cliente ya puede consultar el día y la hora de entrega.");
}

form.addEventListener("submit", handleRequestSubmit);
$("clientPhone").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
});
$("plate").addEventListener("input", (event) => {
  const raw = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const letters = raw.replace(/[^A-Z]/g, "").slice(0, 3);
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 4);
  event.target.value = `${letters}${letters.length === 3 && digits ? "-" : ""}${digits}`;
});
$("brand").addEventListener("change", () => { $("model").value = ""; updateModelOptions(); });
["year", "mileage"].forEach((id) => {
  $(id).addEventListener("wheel", (event) => {
    if (document.activeElement !== event.currentTarget) return;
    event.preventDefault();
    const input = event.currentTarget;
    const step = Number(input.step) || 1;
    const next = Number(input.value || input.min || 0) + (event.deltaY < 0 ? step : -step);
    input.value = String(Math.min(Number(input.max), Math.max(Number(input.min), next)));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, { passive: false });
});
loginForm.addEventListener("submit", handleLogin);
$("authSwitch").addEventListener("click", () => setAuthMode(!registering));
$("logoutBtn").addEventListener("click", logout);
$("cancelEdit").addEventListener("click", resetRequestForm);
$("requestRows").addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  if (editButton) beginEdit(editButton.dataset.edit);
  if (deleteButton) deleteRequest(deleteButton.dataset.delete);
});
$("requestRows").addEventListener("change", (event) => {
  const select = event.target.closest("[data-status]");
  if (select) changeStatus(select.dataset.status, select.value);
});
document.querySelectorAll("[data-screen-link]").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  const screen = link.dataset.screenLink;
  if ((screen === "dashboard" || screen === "request") && !currentUser) { showScreen("login"); return; }
  if (screen === "request" && !$("editId").value) resetRequestForm();
  showScreen(screen);
  if (screen === "home" && link.hash && link.hash !== "#inicio") {
    history.replaceState(null, "", link.hash);
    requestAnimationFrame(() => $(link.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
}));
$("newRequestBtn").addEventListener("click", () => { resetRequestForm(); showScreen("request"); });
setAuthMode(false);
renderPanel();
showScreen(currentUser ? "dashboard" : "home");
