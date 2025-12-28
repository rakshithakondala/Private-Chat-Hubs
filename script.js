const socket = io();

/* ---------- ADMIN ---------- */
function createRoom() {
    const adminName = document.getElementById("adminName").value;
    const roomName = document.getElementById("adminRoom").value;

    if (adminName === "" || roomName === "") {
        alert("Enter admin name and room name");
        return;
    }

    socket.emit("createRoom", { adminName, roomName });
}

socket.on("roomCreated", (roomCode) => {
    alert("Room Created!\nRoom Code: " + roomCode);

    // OPEN CHAT PAGE IN NEW TAB
    window.open(
        `chat.html?username=${encodeURIComponent("Admin")}&roomCode=${roomCode}`,
        "_blank"
    );
});

/* ---------- USER ---------- */
function joinRoom() {
    const username = document.getElementById("username").value;
    const roomCode = document.getElementById("joinCode").value;

    if (username === "" || roomCode === "") {
        alert("Enter username and room code");
        return;
    }

    // OPEN CHAT PAGE IN NEW TAB
    window.open(
        `chat.html?username=${encodeURIComponent(username)}&roomCode=${roomCode}`,
        "_blank"
    );
}
