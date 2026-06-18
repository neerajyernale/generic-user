const cl = console.log;
const userForm = document.getElementById('userForm');
const nameControl = document.getElementById('name');
const usernameControl = document.getElementById('username');
const emailControl = document.getElementById('email');
const contactControl = document.getElementById('contact');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const userContainer = document.getElementById('userContainer');
const spinner = document.getElementById('spinner');


let userArr = [];

let baseUrl = "https://jsonplaceholder.typicode.com";
let user_Url = `${baseUrl}/users`;

function snackbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    });
}

function createUser(arr){
    let result = '';
    arr.forEach((user,i)=>{
        result+=`
        <tr id="${user.id}">
        <td>${arr.length -i}</td>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td> <button onClick="onEdit(this)" class="btn color2 me-2">
        <i class="fa-solid fa-pen-to-square me-1"></i> Edit
         </button> 
        <button onClick="onRemove(this)" class="btn btn-danger">
        <i class="fa-solid fa-trash me-1"></i> Remove
        </button>
        </td>

    </tr>`
    
    });
    userContainer.innerHTML = result;
} 

makeApiCall('GET',user_Url,null,createUser,snackbar);


function makeApiCall(methodName,Api_Url,body = null,successCb,errorCb){
 
   body = body ? JSON.stringify(body):null  
   
    let xhr = new XMLHttpRequest();

    xhr.open(methodName,Api_Url);
    
    xhr.send(body);

    xhr.onload = function (){
        if(xhr.status>=200 && xhr.status<= 299){
        let res = JSON.parse(xhr.response)
         if(methodName === 'GET'){
            userArr=res;
            successCb(res);
            // createUser(userArr.reverse());
         } else if (methodName === 'POST'){
            let obj = {...JSON.parse(body),id:res.id}
            successCb(obj);
         }else if(methodName === 'PATCH' || methodName === 'PULL'){
            successCb(JSON.parse(body))
         }else{
            successCb()
         }

        }else{
            errorCb(xhr)
        }
    }
    xhr.onerror = function (){
        errorCb(xhr);
    }

}


function onCreate(ele){
    spinner.classList.remove('d-none');
    ele.preventDefault();
    let newObj = {
        name:nameControl.value,
        username:usernameControl.value,
        email:emailControl.value,
        phone:contactControl.value,
    }
    userArr.push(newObj);
    let user_Url = `${baseUrl}/users`;
    makeApiCall('POST',user_Url,newObj,createCardOnUi,snackbar);
}


function createCardOnUi(response){
    let tr = document.createElement('tr');
    tr.id = response.id;

    tr.innerHTML = ` <td>${userArr.length}</td>
        <td>${response.name}</td>
        <td>${response.username}</td>
        <td>${response.email}</td>
        <td>${response.phone}</td>
        <td> <button onClick="onEdit(this)" class="btn color2 me-2">
        <i class="fa-solid fa-pen-to-square me-1"></i> Edit
         </button> 
        <button onClick="onRemove(this)" class="btn btn-danger">
        <i class="fa-solid fa-trash me-1"></i> Remove
        </button>
        </td>`
       spinner.classList.add('d-none');
        userContainer.prepend(tr);
}
userForm.addEventListener('submit',onCreate);

function onRemove(ele){
    let removeId = ele.closest('tr').id;
    let removeUrl = `${baseUrl}/users/${removeId}`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            spinner.classList.remove('d-none'); 
            localStorage.setItem('removeId', removeId);
            makeApiCall('DELETE', removeUrl, null, removeFromUi, snackbar);
        }
    });
}

function removeFromUi(){
    let removeId = localStorage.getItem('removeId');
    document.getElementById(removeId).remove();

    Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
    });

    spinner.classList.add('d-none'); 
    let allTrs = [...document.querySelectorAll('#userContainer tr')];
    allTrs.forEach((tr,i)=>{
        tr.children[0].textContent = allTrs.length-i; 
    });
}

function onEdit(ele){
    spinner.classList.remove('d-none');
    let editId = ele.closest('tr').id;
    localStorage.setItem('editId',editId);
    let editUrl = `${baseUrl}/users/${editId}`;
    makeApiCall('GET',editUrl,null,pathOnUi,snackbar)
}

function pathOnUi(postObj){
  nameControl.value = postObj.name;
  usernameControl.value = postObj.username;
  emailControl.value = postObj.email;
  contactControl.value = postObj.phone;
  spinner.classList.add('d-none');
  addBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none')


}


function onUpdate(){
    spinner.classList.remove('d-none');
    let updateId = localStorage.getItem('editId');
    let updateObj = {
        name: nameControl.value,
        username: usernameControl.value,
        email: emailControl.value,
        phone: contactControl.value,
    };

    let updateUrl = `${baseUrl}/users/${updateId}`;
    makeApiCall('PATCH', updateUrl, updateObj, () => updateOnUi(updateId, updateObj), snackbar);
}

function updateOnUi(updateId, updateObj){
    let tr = document.getElementById(updateId).children;
    tr[1].innerHTML = updateObj.name;
    tr[2].innerHTML = updateObj.username;
    tr[3].innerHTML = updateObj.email;
    tr[4].innerHTML = updateObj.phone;
     Swal.fire({
              title: "User updated successfully",
              icon: "success",
              timer: 800,
              showConfirmButton: false,
              });
    spinner.classList.add('d-none');          
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none')

    userForm.reset();                     
    localStorage.removeItem('editId');    
}
updateBtn.addEventListener('click',onUpdate)





