function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    document.getElementById("timeDisplay").innerText = timeString;
}

setInterval(updateTime, 1000); 
