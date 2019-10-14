//Variabler
let name, pass;


//DOM
let nameInp = document.getElementById("username");
let passwordInp = document.getElementById("password");
let logInBtn = document.getElementById("loginBtn");
let form = document.getElementsByClassName("form");
let errorText = document.getElementsByClassName("error");


//När man klickar på Logga In knapp
logInBtn.onclick = function () {
    name = nameInp.value;
    pass = passwordInp.value;
    
    if (name != "" && pass != "") {
        fetch('users.json')
        .then(response => response.json())
        .then(function(jsonUsers){
            let userFound = false;
            for(let countUser = 0; countUser < jsonUsers.length && !userFound; countUser++){
                if (jsonUsers[countUser].name === name && jsonUsers[countUser].password === pass) {
                  userFound = true;
                  sessionStorage.setItem('usersID', jsonUsers[countUser].id);
                  window.open("board.html", "_self");
                }               
            }
            if (!userFound) {
                errorText[0].style.display = "block";
            }
        })
        .catch(err => console.log(JSON.stringify(err)));
    } else {
        errorText[0].style.display = "block";
    }
}