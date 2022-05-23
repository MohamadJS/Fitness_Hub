const form = document.querySelector(".validated-form");
const input = document.querySelectorAll("input");
const message = document.querySelectorAll(".invalid-feedback");
const textArea = document.querySelectorAll("textarea");

let pattern = /image-*/;

input.forEach(i => {
    i.addEventListener("input", (e) => {
        e.target.name == "recipe[title]" ? feedback(e, message[0]) : feedback(e, message[1]);
    })
})

textArea.forEach(i => {
    i.addEventListener("input", (e) => {
        e.target.name == "recipe[ingredients]" ? feedback(e, message[2]) : feedback(e, message[3]);
    })
})

function feedback(e, iMessage) {

    if (e.target.localName == "input") {
        switch (e.target.name) {
            case "recipe[title]":
                if (e.target.value.trim() == '') {
                    iMessage.classList.add("active");
                    input[0].classList.add("invalid");
                } else if (iMessage.classList.contains("active")) {
                    iMessage.classList.remove("active");
                    input[0].classList.remove("invalid");
                }
                break;
            case "image":
                if (!e.target.checkValidity()) {
                    iMessage.innerText = "An image is required";
                    iMessage.classList.add("active");
                } else if (!e.target.files[0].type.match(pattern)) {
                    iMessage.innerText = "Invalid file format.";
                    iMessage.classList.add("active");
                } else if (iMessage.classList.contains("active")) {
                    iMessage.classList.remove("active");
                }
                break;
        }

    }
    else {
        switch (e.target.name) {
            case "recipe[ingredients]":
                if (e.target.value.trim() == '') {
                    iMessage.classList.add("active");
                    textArea[0].classList.add("invalid");   
                } else if (iMessage.classList.contains("active")) {
                    iMessage.classList.remove("active");
                    textArea[0].classList.remove("invalid");  
                }
                break;
            case "recipe[body]":
                if (e.target.value.trim() == '') {
                    iMessage.classList.add("active");
                    textArea[1].classList.add("invalid");   
                } else if (iMessage.classList.contains("active")) {
                    iMessage.classList.remove("active");
                    textArea[1].classList.remove("invalid");  
                }
                break;
        }
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    valid = true;
    for (let i of input) {
        if (i.name == "recipe[title]" && i.value.trim() == '') {
            message[0].classList.add("active");
            i.classList.add("invalid");
            valid = false;
        }
        else if (i.name == "image") {
            if (!i.checkValidity()) {
                message[1].innerText = "An image is required."
                message[1].classList.add("active");
                valid = false;
            } else if (!document.location.toString().includes("/edit") && !i.files[0]?.type.match(pattern)) {
                message[1].innerText = "Invalid file format.";
                message[1].classList.add("active");
                valid = false;
            }
        }
    }
    for (let i of textArea) {
        if (i.value.trim() == '') {
            i.name == "recipe[ingredients]" ? message[2].classList.add("active") : message[3].classList.add("active");
            i.classList.add("invalid");
            valid = false;
        }
    }

    if (valid) {
        form.submit();
    }
})