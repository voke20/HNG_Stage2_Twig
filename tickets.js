document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("ticketapp_session"));
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const tableBody = document.getElementById("ticketTableBody");
  const createBtn = document.getElementById("createTicketBtn");
  const modal = document.getElementById("ticketModal");
  const form = document.getElementById("ticketForm");
  const titleInput = document.getElementById("ticketTitle");
  const statusSelect = document.getElementById("ticketStatus");
  const modalTitle = document.getElementById("modalTitle");
  const cancelBtn = document.getElementById("cancelBtn");

  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  let editIndex = null;

  function renderTickets() {
    tableBody.innerHTML = "";
    tickets.forEach((ticket, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${ticket.id}</td>
        <td>${ticket.title}</td>
        <td><span class="status ${ticket.status.toLowerCase().replace(" ", "")}">${ticket.status}</span></td>
        <td>
          <button class="edit-btn" data-index="${i}">Edit</button>
          <button class="delete-btn" data-index="${i}">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function openModal(isEdit = false, ticket = null) {
    modal.style.display = "flex";
    if (isEdit) {
      modalTitle.textContent = "Edit Ticket";
      titleInput.value = ticket.title;
      statusSelect.value = ticket.status;
    } else {
      modalTitle.textContent = "Create Ticket";
      form.reset();
    }
  }

  function closeModal() {
    modal.style.display = "none";
    editIndex = null;
  }

  // CREATE
  createBtn.addEventListener("click", () => {
    openModal(false);
  });

  // SUBMIT FORM
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const status = statusSelect.value;

    if (!title) return alert("Title is required.");

    if (editIndex !== null) {
      tickets[editIndex].title = title;
      tickets[editIndex].status = status;
    } else {
      const newTicket = {
        id: Math.floor(Math.random() * 9000) + 1000,
        title,
        status,
        date: new Date().toLocaleDateString(),
      };
      tickets.push(newTicket);
    }

    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderTickets();
    closeModal();
  });

  // EDIT & DELETE
  tableBody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("edit-btn")) {
      editIndex = index;
      openModal(true, tickets[index]);
    }

    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this ticket?")) {
        tickets.splice(index, 1);
        localStorage.setItem("tickets", JSON.stringify(tickets));
        renderTickets();
      }
    }
  });

  // CANCEL BUTTON
  cancelBtn.addEventListener("click", closeModal);

  // CLOSE MODAL ON OUTSIDE CLICK
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // LOGOUT
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("ticketapp_session");
    window.location.href = "login.html";
  });

  renderTickets();
});
