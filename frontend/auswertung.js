import { io } from './node_modules/socket.io-client/dist/socket.io.esm.min.js'

const socket = io();

let firstWinner = false;
socket.emit("joinRoom", { username: 'admin', room: 'auswertung', message: false })

socket.on('roomJoined', (data) => {
    const template = document.getElementById("bar-template");
    const clone = template.content.cloneNode(true);
    
    clone.querySelector('.teamname').innerHTML = data;
    clone.querySelector('.flex').dataset.team = data;
    document.querySelector('[datajs="outlet"]').appendChild(clone);
    
    console.log(`You connected with id: ${socket.id}`);
});

socket.on('button-clicked', (username) => {
    success(1, username);
});

socket.on('q2_success', (username) => {
    success(2, username);
});

socket.on('q3_success', (username) => {
    success(3, username);
});

socket.on('q4_success', (username) => {
    success(4, username);
});

function success(questionsNumber, username) {
    document.getElementById('audiofile').currentTime = 0;
    document.getElementById('audiofile').play();
    const row = document.querySelector('[data-team="'+username+'"');
    row.querySelector('.progress_' + questionsNumber).style.backgroundColor = '#0DAEAA';
    checkIfGewonnen(row);
}

function checkIfGewonnen(row) {
    if (firstWinner) return;

    const elements = Array.from(row.querySelectorAll('.progress'));
    const finished = elements.filter(element => window.getComputedStyle( element ,null).getPropertyValue('background-color') === 'rgb(13, 174, 170)').length === 4;

    if (finished) {
        firstWinner = true;
        elements.forEach(element => {
            element.style.backgroundColor = 'green';
        })
    }
}

document.querySelector('h1').addEventListener('click', () => {
    socket.emit('startGame');
})