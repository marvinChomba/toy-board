// declare global vars
const form = document.querySelector("form")
const list = document.querySelector("ul")
const editBtn = document.querySelector(".edit")


// adding elements
function addListElement(doc) {
    let li = document.createElement("li");
    let activity = document.createElement("span");
    let name = document.createElement("span")
    let del = document.createElement("button")
    let updateBtn = document.createElement("button")
    let btnContainer = document.createElement("div")
    // add attributes
    li.setAttribute("id", doc.id)
    activity.setAttribute("class", "activity")
    name.setAttribute("class", "name")
    del.setAttribute("class","del")
    btnContainer.setAttribute("class", "btnContainer")
    updateBtn.setAttribute("class", "btn blue darken-3")
    del.setAttribute("class", "btn red darken-3")

    // add content
    activity.textContent = doc.data().activity
    name.textContent = doc.data().name
    del.textContent = "Delete"
    updateBtn.textContent = "Edit"

    li.appendChild(activity)
    li.appendChild(name)
    btnContainer.appendChild(del)
    btnContainer.appendChild(updateBtn)
    li.appendChild(btnContainer)
    list.appendChild(li)


    del.addEventListener("click", e => {
        let div = e.target.parentElement
        let id = div.parentElement.getAttribute("id")
        db.collection("todos").doc(id).delete()
    })
    
    updateBtn.addEventListener("click", e => {
        let div = e.target.parentElement
        let id = div.parentElement.getAttribute("id")
        let doc = db.collection("todos").doc(id).get().then(data => {
            form.activity.value = data.data().activity
            form.name.value = data.data().name
        });
        editBtn.style.display = "block"
        editBtn.addEventListener("click", () => {
            alert(id)
            db.collection("todos").doc(id).set({
                activity: form.activity.data,
                name: form.name.data
            })
            form.activity.value = ""
            form.name.value = ""
        })
    })

}

// saving data
form.addEventListener("submit", e => {
    e.preventDefault()
    db.collection("todos").add({
        activity: form.activity.value,
        name: form.name.value
    })
    form.activity.value = ""
    form.name.value = ""
})

// real-time stuff
db.collection("todos").onSnapshot(snapshot => {
    changes = snapshot.docChanges()
    changes.forEach(change => {
        if(change.type === "added") {
            addListElement(change.doc)
        } else if(change.type === "removed") {
            let removed = list.querySelector("[id=" + change.doc.id + "]")
            list.removeChild(removed)
        }
    })
})
