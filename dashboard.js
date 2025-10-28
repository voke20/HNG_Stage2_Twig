document.addEventListener("DOMContentLoaded", () => {
  // Session validation
  const session = JSON.parse(localStorage.getItem("ticketapp_session"));
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  // Count tickets by status
  const openCount = tickets.filter(t => t.status.toLowerCase() === "open").length;
  const progressCount = tickets.filter(t => t.status.toLowerCase() === "in progress").length;
  const closedCount = tickets.filter(t => t.status.toLowerCase() === "closed").length;

  // Update dashboard cards
  document.querySelector(".stat-card.open p").textContent = openCount;
  document.querySelector(".stat-card.progress p").textContent = progressCount;
  document.querySelector(".stat-card.closed p").textContent = closedCount;

  // Populate recent tickets
  const tableBody = document.querySelector(".recent-tickets tbody");
  tableBody.innerHTML = "";

  tickets.slice(-3).reverse().forEach(ticket => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${ticket.id}</td>
      <td>${ticket.title}</td>
      <td><span class="status ${ticket.status.toLowerCase().replace(" ", "")}">${ticket.status}</span></td>
      <td>${ticket.date || "—"}</td>
    `;
    tableBody.appendChild(tr);
  });

  document.querySelector(".create-ticket").addEventListener("click", () => {
  window.location.href = "tickets.html";
});

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("ticketapp_session");
    window.location.href = "login.html";
  });
});
