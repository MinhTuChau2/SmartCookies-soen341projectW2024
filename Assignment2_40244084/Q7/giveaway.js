document.getElementById('giveawayForm').addEventListener('submit', function(e) {
    var breed = document.getElementById('breed').value;
    var ownerName = document.getElementById('owner_name').value;
    var ownerEmail = document.getElementById('owner_email').value;
    var comments = document.getElementById('comments').value;
    
    if (breed === '' || ownerName === '' || ownerEmail === '' || comments === '') {
        document.getElementById('errorMessage').innerText = 'Please fill in all required fields';
        e.preventDefault();
        return false;
    }

    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(ownerEmail)) {
        document.getElementById('errorMessage').innerText = 'Please enter a valid email address';
        e.preventDefault();
        return false;
    }
});
