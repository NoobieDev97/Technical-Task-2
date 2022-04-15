//Toggling between Login and Account Creation forms

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form-hidden");
        createAccountForm.classList.remove("form-hidden");
    });
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form-hidden");
        createAccountForm.classList.add("form-hidden");
    });
});

//SignUp Data

const signUp = e => {
    let userName = document.getElementById("userName").value,
        fname = document.getElementById("firstName").value,
        lname = document.getElementById("lastName").value,
        email = document.getElementById("email").value,
        pwd = document.getElementById("pwd").value
    let formData = JSON.parse(localStorage.getItem('formData')) || [];
    let exist = formData.length &&
        JSON.parse(localStorage.getItem('formData')).some(data =>
            data.fname.toLowerCase() == fname.toLowerCase() &&
            data.lname.toLowerCase() == lname.toLowerCase()
        );
    if (!exist) {
        formData.push({
            userName,
            fname,
            lname,
            email,
            pwd
        });
        localStorage.setItem('formData', JSON.stringify(formData));
        document.querySelector('form').reset();
        document.getElementById('fname').focus();
        alert("Account Created.\n\nPlease Sign In using the link below.");
    } else {
        alert("Ooopppssss... Duplicate found!!!\nYou have already signed up");
    }
    e.preventDefault();
}
//Login Method
function signIn(e) {
    let userName = document.getElementById('loginuserName').value,
        pwd = document.getElementById('loginPwd').value;
    let formData = JSON.parse(localStorage.getItem('formData')) || [];
    let exist = formData.length &&
        JSON.parse(localStorage.getItem('formData')).some(data => data.userName.toLowerCase() == userName.toLowerCase() && data.pwd.toLowerCase() == pwd.toLowerCase());
    if (!exist) {
        //alert("Incorrect login credentials");
        displayInvalidLoginAlert();
    } else {
        location.href = "./home.html";
    }
    e.preventDefault();
}

function displayInvalidLoginAlert() {
    let invalidAlertBox = document.getElementById("invalidLoginAlert");
    invalidAlertBox.style.display = "block";
    setTimeout(() => {
        invalidAlertBox.style.display = 'none';
    }, 5000);
}
//Fetching Data from API
async function loadData(pagenumber) {
    let url = "https://reqres.in/api/users?";
    const response = await fetch(url + new URLSearchParams({
        "page": pagenumber,
    }));
    const userData = await response.json();
    renderPaginationButtons(userData['total_pages'])
    renderTableData(userData);
}
const changeDisplayData = (pageNumber) => {
    loadData(pageNumber);
}

//Requesting Delete method to API

async function deleteData(id) {
    let url = "https://reqres.in/api/users/"+id;
    const response = await fetch(url, {method:"DELETE"});
    console.log(response);
    if(response.ok){
        alert("Deleted Successfully");
    }
    else{
        alert("Unable to delete");
    }
}

//Requesting PUT method for Updating users in API

async function updateData(id, name, job) {
    let url = "https://reqres.in/api/users/"+id;
    const response = await fetch(url, {method:"PUT", body:JSON.stringify({"name":name, "job":job}), headers:{'Content-Type':'application/json'}});
    console.log(response);
    if(response.ok){
        alert("Updated Successfully");
    }
    else{
        alert("Unable to update");
    }
}

//Requesting POST method for Creating users in API

async function createData(name, job) {
    let url = "https://reqres.in/api/users/";
    const response = await fetch(url, {method:"POST", body:JSON.stringify({"name":name, "job":job}), headers:{'Content-Type':'application/json'}});
    const data = await response.json();
    console.log(data);
    if(response.ok){
        alert("Created Successfully with the id "+ data.id);
    }
    else{
        alert("Unable to create");
    }
}

//Creating Pagination Buttons

const renderPaginationButtons = (noOfPages) => {
    let buttonGroupNode = document.getElementById("pagination-buttons");
    buttonGroupNode.innerHTML = "";
    for(let i=1;i<=noOfPages;i++){
        let button = document.createElement('button');
        button.textContent = i;
        buttonGroupNode.appendChild(button);
        button.onclick = () => {loadData(i)};
    }
}

const renderTableData = (response) => {
    let tableNode = document.getElementById("userTable");
    tableNode.childNodes.item(1).textContent = "Available Users in Page -" + response['page'];
    let tableBodyNode = tableNode.childNodes.item(5);
    tableBodyNode.innerHTML = "";
    response['data'].map((row) => {
        let tableRowNode = document.createElement('tr');
        let idTableCell = document.createElement('td');
        let firstNameTableCell = document.createElement('td');
        let lastNameTableCell = document.createElement('td');
        let actionTableCell = document.createElement('td');
        idTableCell.textContent = row['id'];
        firstNameTableCell.textContent = row['first_name'];
        lastNameTableCell.textContent = row['last_name'];
        let viewButtonNode = document.createElement('button');
        viewButtonNode.classList.add("view-btn"); 
        viewButtonNode.innerText = "View";
        viewButtonNode.onclick = function() {
            openViewUser(row);
        }
        let editButtonNode = document.createElement('button');
        editButtonNode.classList.add("edit-btn"); 
        editButtonNode.innerText = "Edit";
        editButtonNode.onclick = function() {
            openEditModal(row['id'], row['first_name']+" "+row['last_name']);
        }
        let deleteButtonNode = document.createElement('button');
        deleteButtonNode.classList.add("delete-btn"); 
        deleteButtonNode.innerText = "Delete";
        deleteButtonNode.onclick = function() {
            openDeleteModal(row['first_name']+" "+row['last_name'], row['id']);
        }
        //Appending Child Elements onto Tabel
        actionTableCell.appendChild(viewButtonNode);
        actionTableCell.appendChild(editButtonNode);
        actionTableCell.appendChild(deleteButtonNode);
        tableRowNode.appendChild(idTableCell);
        tableRowNode.appendChild(firstNameTableCell);
        tableRowNode.appendChild(lastNameTableCell);
        tableRowNode.appendChild(actionTableCell);
        tableBodyNode.appendChild(tableRowNode);
    })
}

//Edit User interface 

const openEditModal = (id, name) => {
    let editFormModal = document.getElementById("editFormModal");
    let closeButton = document.getElementById("editFormClose");
    let nameInput = document.getElementById("editName");
    nameInput.value = name;
    let jobInput = document.getElementById("editJob");
    closeButton.onclick = function() {
        editFormModal.style.display = "none";
    }
    editFormModal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == editFormModal){
            editFormModal.style.display = "none";
        }
    }

    let editButtonNode = document.getElementById("editConfirm");
    editButtonNode.onclick = function() {
        updateData(id, nameInput.value, jobInput.value);
    }
    
}

//Create User interface 

const openCreateModal = () => {
    let createFormModal = document.getElementById("createFormModal");
    let closeButton = document.getElementById("createFormClose");

    let nameInput = document.getElementById("createName");
    let jobInput = document.getElementById("createJob");

    closeButton.onclick = function() {
        createFormModal.style.display = "none";
    }
    createFormModal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == createFormModal){
            createFormModal.style.display = "none";
        }
    }

    let createButton = document.getElementById("createConfirm");
    createButton.onclick = function() {
        createData(nameInput.value, jobInput.value);  
    }
}

const openDeleteModal = (name, id) => {
    let deleteFormModal = document.getElementById("deleteFormModal");
    let deleteCaption = document.getElementById("deleteButtonCaption");
    deleteCaption.innerHTML = "<h3>Do you want to delete "+name+"</h3>";
    let closeButton = document.getElementById("deleteFormClose");

    let deleteButtonNode = document.getElementById("deleteConfirm");

    closeButton.onclick = function() {
        deleteFormModal.style.display = "none";
    }
    deleteFormModal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == deleteFormModal){
            deleteFormModal.style.display = "none";
        }
    }

    deleteButtonNode.onclick = function() {
        deleteData(id);
    }
    
}

const openViewUser = (user) => {
    console.log(user);
    let openViewUserModal = document.getElementById("viewUserModal");
    let closeButton = document.getElementById("viewUserClose");
    closeButton.onclick = function() {
        openViewUserModal.style.display = "none";
    }
    openViewUserModal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == openViewUserModal){
            openViewUserModal.style.display = "none";
        }
    }

    // Update User Details
    let imageNode = document.getElementById("userImage");
    let nameNode = document.getElementById("userTitle");
    let emailNode = document.getElementById("userEmail");

    imageNode.setAttribute("src",user['avatar']);
    nameNode.innerText = user['first_name'] + " " + user['last_name'];
    emailNode.innerText = user['email'];
}

document.getElementById("createUser").onclick = openCreateModal;

loadData(1);

