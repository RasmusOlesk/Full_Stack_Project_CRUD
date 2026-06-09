const API_URL = "http://localhost:5132/api/tasks";

export async function getTasks() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Ülesannete laadimine ebaõnnestus");
  }

  return response.json();
}

export async function createTask(task) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Ülesande lisamine ebaõnnestus");
  }

  return response.json();
}

export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Ülesande muutmine ebaõnnestus");
  }
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Ülesande kustutamine ebaõnnestus");
  }
}
