function calculateOrder() {
    // Get the quantities from the input fields
    var basicQuantity = document.getElementById("basicQuantity").value;
    var phpQuantity = document.getElementById("phpQuantity").value;
    var jqueryQuantity = document.getElementById("jqueryQuantity").value;

    // Check if any of the quantities are not integers or are blank
    if (isNaN(basicQuantity) || basicQuantity === '' || isNaN(phpQuantity) || phpQuantity === '' || isNaN(jqueryQuantity) || jqueryQuantity === '') {
        alert("Please enter an integer value for all quantities.");
        return false;
    }

    // Convert the quantities to numbers
    basicQuantity = parseInt(basicQuantity);
    phpQuantity = parseInt(phpQuantity);
    jqueryQuantity = parseInt(jqueryQuantity);

    // Calculate the total for each book
    var basicTotal = basicQuantity * 19.99;
    var phpTotal = phpQuantity * 86.00;
    var jqueryTotal = jqueryQuantity * 55.00;

    // Calculate the final total
    var finalTotal = basicTotal + phpTotal + jqueryTotal;

    // Create the summary string
    // Create the summary string
var summary = "<strong>Basic Web Programming (Quantity=" + basicQuantity + "):</strong> $" + basicTotal.toFixed(2) + "<br>";
summary += "<strong>Intro to PHP (Quantity=" + phpQuantity + "):</strong> $" + phpTotal.toFixed(2) + "<br>";
summary += "<strong>Advanced Jquery (Quantity=" + jqueryQuantity + "):</strong> $" + jqueryTotal.toFixed(2) + "<br><br>";
summary += "<strong>Final Total:</strong> $" + finalTotal.toFixed(2);

// Display the summary on the page
document.getElementById("output").innerHTML = summary;



    // Prevent the form from actually submitting
    return false;
}
