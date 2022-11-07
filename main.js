const API = "http://localhost:8000/memos";

//? variables for input
let image = document.querySelector(".image");
let date = document.querySelector(".date");
let memory = document.querySelector(".memory");
let people = document.querySelector(".people");

let btnSaveCreate = document.querySelector("#create-save");
let btnCancelCreate = document.querySelector("#create-close");

let createBtn = document.querySelector(".btn-create");
let modalCreate = document.querySelector(".modal-create");

//? переменные для карточек

let book = document.querySelector(".book");

//? переменные для показа карточек

//?переменные для поиска

let searchInp = document.querySelector("#search-input");
let searchValue = "";

//? переменные для эдита
let editImage = document.querySelector(".edit-image");
let editDate = document.querySelector(".edit-date");
let editMemory = document.querySelector(".edit-memory");
let editPeople = document.querySelector(".edit-people");

let editSaveBtn = document.querySelector("#edit-save");
let closeBtn = document.querySelector("#edit-close");

let modal = document.querySelector(".modal-edit");
// ? показываем модальное окно для создания мема

//? переменные для создания
btnCancelCreate.addEventListener("click", () => {
  modalCreate.style.display = "none";
  createBtn.style.display = "block";
});

createBtn.addEventListener("click", () => {
  modalCreate.style.display = "flex";
  createBtn.style.display = "none";
});

//? pagination
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

//?закидываем данные на сервер

btnSaveCreate.addEventListener("click", async function () {
  let obj = {
    image: image.value,
    date: date.value,
    memory: memory.value,
    people: people.value,
  };

  if (
    !obj.image.trim() ||
    !obj.date.trim() ||
    !obj.memory.trim() ||
    !obj.people.trim()
  ) {
    alert("заполните все поля");
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  image.value = "";
  date.value = "";
  memory.value = "";
  people.value = "";

  render();
  modalCreate.style.display = "none";
  createBtn.style.display = "block";
});

//? отображаем карточки на странице
async function render() {
  let people = await fetch(
    `${API}?q=${searchValue}&_limit=1&_page=${currentPage}`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
  drawPaginationButtons();
  book.innerHTML = "";
  console.log(people);
  people.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.classList.add("card");
    newElem.id = element.id;
    newElem.innerHTML = `
   
    <div class="front">
        <img src="${element.image}" alt="">
        <div class="info">
            <p class="dateN">DATE:${element.date}</p>

        </div>
        <div class="peopleN">PEOPLE:${element.memory}</div>
<div class="descr">MEMORIES:${element.people}</div>
<div class="btnsEdit">
    <button id="${element.id}" class="btnEdit btn-edit">edit</button>
    <button id="" onclick="deleteProduct(${element.id})"  class="btnDelete btn-delete">delete</button>
</div>

    </div>
    `;
    book.append(newElem);
  });
}

render();
//? delete
function deleteProduct(id) {
  //   console.log(id);
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}

//? edit

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    createBtn.style.display = "none";
    modal.style.display = "flex";
    console.log(e.target.id);
    let id = e.target.id;
    console.log(id);
    //object response
    //promise
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editImage.value = data.image;
        editDate.value = data.date;
        editMemory.value = data.memory;
        editPeople.value = data.people;
        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

closeBtn.addEventListener("click", () => {
  createBtn.style.display = "block";
  modal.style.display = "none";
});

//! созранение изменений товара
editSaveBtn.addEventListener("click", function () {
  let id = this.id; // вытаскиваем из кнопки id и ложим ее в переменную
  let image = editImage.value;
  let date = editDate.value;
  let memory = editMemory.value;
  let people = editPeople.value;

  if (!image || !date || !memory || !people) return; // проверка на заполненность полей в модальном окне
  // if (image == "") {
  //   obj.image =
  //     "https://i.pinimg.com/236x/86/8f/e0/868fe0981546b91df095c9c766f6239f.jpg";
  // }
  let editedPeople = {
    image: image,
    date: date,
    memory: memory,
    people: people,
  };

  saveEdit(editedPeople, id);
});

function saveEdit(editedPeople, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedPeople),
  }).then(() => {
    render();
  });
  createBtn.style.display = "block";
  modal.style.display = "none";
}

searchInp.addEventListener("input", () => {
  searchValue = searchInp.value; //Записывает значение из поисковика в переменную searchVal
  render();
});

//!pagination-----------------------
function drawPaginationButtons() {
  fetch(`${API}?q=${searchValue}`) //делаем запос на сервер чтьоы узнать общее колво родуктовр
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      pageTotalCount = Math.ceil(data.length / 1); // обзор колво продуктов делис на колво продуктов, которое отобрадается на одной странице
      //pagetotalcount = колво страниц которое у нас будет
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        console.log(i == currentPage, currentPage, i);
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item active" style="color: red !important"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.appendChild(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item" id="page-item-${i}"><a class="page-link page_number" href="#">${i}</a></li>`;

          page1.addEventListener("click", (e) => {
            currentPage = e.target.innerText;
            render();
          });
          paginationList.appendChild(page1);
          console.log(paginationList);
        }
      }
      //
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}
//? кнопка переключения на предыдущую страницу
prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});
//? кнопка переключения на слудущую страницу
next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

// document.addEventListener("mouseover", (e) => {
//   if (e.target.classList.contains("front")) {
//     let front = document.querySelector(".front");
//     let modalMemos = document.querySelector(".modal-memories");
//     front.style.display = "none";
//   }
// });

// console.log(card);

// {
/* <div class="modal-memories"> */
// }
// {
/* <div class="peopleN">PEOPLE:${element.people}</div>
<div class="descr">MEMORIES:${element.memory}</div>
<div class="btnsEdit">
    <button id="" class="btnEdit btn-edit">edit</button>
    <button id="" class="btnDelete btn-delete">delete</button>
</div>
</div> */
// }
