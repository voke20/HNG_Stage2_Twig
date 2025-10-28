document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch dashboard data
    const response = await fetch('/api/dashboard', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();

    // Update dashboard cards
    document.querySelector(".stat-card.open p").textContent = data.stats.open;
    document.querySelector(".stat-card.progress p").textContent = data.stats.inProgress;
    document.querySelector(".stat-card.closed p").textContent = data.stats.closed;

    // Populate recent tickets
    const tableBody = document.querySelector(".recent-tickets tbody");
    tableBody.innerHTML = "";

    if (data.recentTickets.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="4" class="text-center">No tickets found</td>';
      tableBody.appendChild(tr);
    } else {
      data.recentTickets.forEach(ticket => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>#${ticket.id}</td>
          <td>${ticket.title}</td>
          <td><span class="status ${ticket.status.toLowerCase().replace(" ", "")}">${ticket.status}</span></td>
          <td>${new Date(ticket.createdAt).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(tr);
      });
    }
  } catch (error) {
    console.error('Error:', error);
    showToast("Failed to load dashboard data", "error");
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error:', error);
      showToast("Failed to logout", "error");
    }
  });
});

// Toast functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}