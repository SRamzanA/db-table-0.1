const manList = document.getElementById("man-list")

const littleUrl = "http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D"

// Маленький объем данных : http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D
// Большой объем данных : http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D

const manListEmpty = `
        <tr class="th-cell">
            <th>Id</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Street address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Description</th>
        </tr>` // Пустая таблица для последующей вставки данных

let man = [] // Список данных

function chunkArray (array, chunkSize) { // Разделение списка по 50 (список, кол-во данных в куске)
    chunkedArray = []
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize))
    }
    return chunkedArray
}
let posPagination = 0
let chunk // Переменная чанк глобальная!

function manListUpdate(posPagination) { // Обновление таблицы html с текущим списком данных
    man = chunk[posPagination]
    man.forEach(function (person, index) {
        containerHTML = `
        <tr class="line-${index % 2 == 0? 'odd' : 'even'}">
            <td>${person.id}</td>
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>${person.email}</td>
            <td>${person.phone}</td>
            <td>${person.address.streetAddress}</td>
            <td>${person.address.city}</td>
            <td>${person.address.state}</td>
            <td>${person.address.zip}</td>
            <td class="td-description">${person.description}</td>
        </tr>
        `
        manList.insertAdjacentHTML("beforeend", containerHTML)
    })
}

fetch(littleUrl).then(response => {
    if(!response.ok) { // Смотрим удачность соединения
        throw new Error("Network response was not ok'")
    }
    return response.json() // Выводим данные в формате JSON
}).then(data => { // Работаем с данными
    man.push(...data)
    man.sort((a, b) => a.id - b.id)
    chunk = chunkArray(man, 50) // Присваеваем переменной чанк данные, разделённые по 50
    console.log("Лог из then:", chunk); // ПОТОМ УДАЛИТЬ
    manListUpdate(posPagination)
}).catch(error => { // Если ошибка
    console.error("There has been a problem with your fetch operation:", error)
})

let sortDirection = document.querySelector(".sort-direction")
let btnSorting = document.querySelector(".btn-sorting")

function sortDirectionChange () { // Функция сортировки
    sortDirection.classList.toggle("change")
    
    if (sortDirection.classList.contains('change')) {
        sortDirection.innerHTML = "&uarr;"
        man.sort((a, b) => b.id - a.id)
        manList.innerHTML = manListEmpty
        manListUpdate()
    } else {
        sortDirection.innerHTML = "&darr;"
        man.sort((a, b) => a.id - b.id)
        manList.innerHTML = manListEmpty
        manListUpdate()
    }
}

btnSorting.addEventListener("click", sortDirectionChange)

const btnPrevPage = document.querySelector(".prev-page")
const btnNextPage = document.querySelector(".next-page")

function assingGreyColor() {
    if (chunk.length == 1) {
        // Присваеваем кнопках серый цвет
    }
}
// assingGreyColor()

function nextPage() {
    if (posPagination != chunk.length - 1) {
       posPagination += 1 
    } else {
        // Присваеваем кнопке серый цвет
    }
    manListUpdate()
}
function prevPage() {
    if (posPagination != 0) {
        posPagination -= 1
    } else {
        // Присваеваем кнопке серый цвет
    }
    manListUpdate()
}

btnNextPage.addEventListener("click", nextPage)


// закончили на том, что при нажатии на смену направления таблицы происходит ошибка. 


