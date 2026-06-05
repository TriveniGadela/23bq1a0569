// ===== LOGGER =====
async function getToken() {
  const res = await fetch("http://4.224.186.213/evaluation-service/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "email": "trivenigadelatriveni@gmail.com",
      "name": "Gadela Triveni",
      "rollNo": "23bq1a0569",
      "accessCode": "QQdEYy",
      "clientID": "779f62aa-7e7b-402f-b4ac-ccfd5a840e57",
      "clientSecret": "GBFrYUPXMtuYwsJM"
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function Log(stack, level, packageName, message) {
  try {
    const token = await getToken();
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "stack": stack,
        "level": level,
        "package": packageName,
        "message": message
      })
    });
    console.log("Log sent:", level, packageName, message);
  } catch (err) {
    console.error("Logging failed:", err);
  }
}

// ===== NOTIFICATIONS =====
const PRIORITY = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};

async function loadNotifications() {
  const topN = parseInt(document.getElementById("topN").value);
  const container = document.getElementById("notifications");
  container.innerHTML = "<div id='loading'>⏳ Loading notifications...</div>";

  await Log("frontend", "info", "page", "Loading notifications started");

  try {
    const token = await getToken();
    await Log("frontend", "info", "api", "Fetching notifications from API");

    const res = await fetch("http://4.224.186.213/evaluation-service/notifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    const notifications = data.notifications;

    await Log("frontend", "info", "api", `Fetched ${notifications.length} notifications successfully`);

    // Sort by priority then recency
    const sorted = notifications.sort((a, b) => {
      const pa = PRIORITY[a.Type] || 0;
      const pb = PRIORITY[b.Type] || 0;
      if (pb !== pa) return pb - pa;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    // Get top N
    const topNotifications = sorted.slice(0, topN);
    await Log("frontend", "info", "component", `Displaying top ${topN} priority notifications`);

    // Render cards
    container.innerHTML = "";
    topNotifications.forEach((n, index) => {
      const type = n.Type.toLowerCase();
      const card = document.createElement("div");
      card.className = `notification-card ${type}`;
      card.innerHTML = `
        <span class="badge ${type}">${n.Type}</span>
        <div class="message"><strong>#${index + 1}</strong> ${n.Message}</div>
        <div class="time">🕒 ${new Date(n.Timestamp).toLocaleString()}</div>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    await Log("frontend", "error", "api", "Failed: " + err.message);
    container.innerHTML = "<p style='color:red'>❌ Failed to load notifications!</p>";
  }
}

// Page load
window.onload = async function() {
  await Log("frontend", "info", "page", "Priority Inbox page loaded successfully");
}

// Button click
document.getElementById("loadBtn").addEventListener("click", async function() {
  await Log("frontend", "debug", "component", "Load Notifications button clicked");
  loadNotifications();
});