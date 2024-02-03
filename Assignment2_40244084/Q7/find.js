function validateForm() {
    var animal = document.getElementById("animal").value;
    var breed = document.getElementById("breed").value;
    var age = document.getElementById("age").value;
    var gender = document.getElementById("gender").value;

    if (animal === "" || breed === "" || age === "" || gender === "") {
        document.getElementById("error").innerHTML = "Please fill in all the fields!";
        return false; // Prevent form submission
    }

    return true; // Allow form submission
}
