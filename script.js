
let drinks = JSON.parse(localStorage.getItem("drinkData")) || [
    { id: 1, flavor: "#1 Watermelon ice & Red bull & Strawberry kiwi", count: 17 }
];

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

function saveData() {
    localStorage.setItem("drinkData", JSON.stringify(drinks));
}

function loadData() {
    renderTable();
    updateTotal();
    renderBookings();
}

function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";
    drinks.forEach(drink => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td contenteditable="true" onblur="updateFlavor(${drink.id}, this.innerText)">${drink.flavor}</td>
            <td id="count-${drink.id}">${drink.count}</td>
            <td>
                <input type="number" id="change-${drink.id}" value="1" style="width:50px;">
                <button onclick="applyChange(${drink.id}, -1)">-</button>
                <button onclick="applyChange(${drink.id}, 1)">+</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateFlavor(id, newFlavor) {
    const drink = drinks.find(d => d.id === id);
    if (drink) {
        drink.flavor = newFlavor;
        saveData();
    }
}

function applyChange(id, direction) {
    const input = document.getElementById(`change-${id}`);
    const value = parseInt(input.value);
    if (!isNaN(value)) {
        const drink = drinks.find(d => d.id === id);
        if (drink) {
            drink.count += direction * value;
            if (drink.count < 0) drink.count = 0;
            document.getElementById(`count-${id}`).innerText = drink.count;
            saveData();
            updateTotal();
        }
    }
}

function addNewFlavor() {
    const name = document.getElementById("newFlavor").value.trim();
    const count = parseInt(document.getElementById("newCount").value.trim());
    if (name && !isNaN(count)) {
        const newId = drinks.length ? Math.max(...drinks.map(d => d.id)) + 1 : 1;
        drinks.push({ id: newId, flavor: name, count: count });
        saveData();
        renderTable();
        updateTotal();
        document.getElementById("newFlavor").value = "";
        document.getElementById("newCount").value = "";
    }
}

function updateTotal() {
    const total = drinks.reduce((sum, d) => sum + d.count, 0);
    document.getElementById("totalCount").innerText = total;
}

function showBookingForm() {
    document.getElementById("bookingForm").style.display = "block";
}

function addBooking() {
    const name = document.getElementById("bookingName").value.trim();
    const flavor = document.getElementById("bookingFlavor").value.trim();
    const amount = document.getElementById("bookingAmount").value.trim();
    if (name && flavor && amount) {
        bookings.push({ name, flavor, amount });
        localStorage.setItem("bookings", JSON.stringify(bookings));
        renderBookings();
        document.getElementById("bookingForm").style.display = "none";
        document.getElementById("bookingName").value = "";
        document.getElementById("bookingFlavor").value = "";
        document.getElementById("bookingAmount").value = "";
    }
}

function renderBookings() {
    const list = document.getElementById("bookingList");
    list.innerHTML = "";
    bookings.forEach((b, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${b.name} - ${b.flavor} - ${b.amount}</span><button onclick="deleteBooking(${index})">🗑</button>`;
        list.appendChild(li);
    });
}

function deleteBooking(index) {
    bookings.splice(index, 1);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    renderBookings();
}

function clearAllBookings() {
    bookings = [];
    localStorage.removeItem("bookings");
    renderBookings();
}


function createIzElem(text) {
  const div = document.createElement("div");
  div.className = "ize";
  div.innerHTML = `
    <span class="plus">+</span>
    <span class="minus">-</span>
    <span class="text">${text}</span>
    <img src="https://dbdzm869oupei.cloudfront.net/img/sticker/preview/13215.png" class="delete-icon" alt="Törlés ikon" style="width:24px; height:24px; cursor:pointer;">
  `;
  div.querySelector(".delete-icon").addEventListener("click", () => {
    div.remove();
    saveAll();
  });
  return div;
}

function saveAll() {
  const items = [...document.querySelectorAll(".ize .text")].map(el => el.textContent);
  localStorage.setItem("izek", JSON.stringify(items));
}

function loadAll() {
  const saved = JSON.parse(localStorage.getItem("izek") || "[]");
  const list = document.getElementById("izek-list");
  saved.forEach(text => {
    const elem = createIzElem(text);
    list.appendChild(elem);
  });
}

function hozzaadIzt() {
  const input = document.getElementById("uj-iz");
  const text = input.value.trim();
  if (text !== "") {
    const list = document.getElementById("izek-list");
    const elem = createIzElem(text);
    list.appendChild(elem);
    input.value = "";
    saveAll();
  }
}

document.addEventListener("DOMContentLoaded", loadAll);