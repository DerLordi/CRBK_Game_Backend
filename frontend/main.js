import { io } from './node_modules/socket.io-client/dist/socket.io.esm.min.js'

const dialog = document.getElementById('dialog');
let username = '';
dialog.showModal();

dialog.querySelector('#btn-submit').addEventListener('click', () => {
    const groupName = document.getElementById('groupName').value;

    if (groupName === '') return;
    username = groupName;

    dialog.close();
    dialog.style.display = 'none';
    const socket = io();

    socket.on('connect', () => {
        console.log(`You connected with id: ${socket.id}`);
    });
    document.querySelector('[datajs="team-name-result"]').innerHTML = username;
    socket.emit("joinRoom", { username: username, room: 'auswertung', message: true })

    document.getElementById('btn').addEventListener('click', ({target}) => {
        socket.emit('button-clicked', {username: username});
        target.disabled = true;
        target.style.backgroundColor = 'green';
        document.querySelector('.description.q1').style.color = 'green';
        setTimeout(() => {
            target.remove();
        }, 2000);
    });

    document.querySelector('[datajs="btn-2"]').addEventListener('click', ({target}) => {
        const input = target.parentElement.querySelector('#founder');
        
        if (input.value.toLowerCase() === 'kevin ashton') {
            socket.emit('q2_success', {username: username});
            target.disabled = true;
            document.querySelector('.description.q2').style.color = 'green';
            setTimeout(() => {
                input.remove();
                target.remove();
            }, 300);
        } else {
            input.value = '';
            target.style.backgroundColor = 'red';
            setTimeout(() => {
                target.style.backgroundColor = '#0DAEAA';
            }, 700);
        }
        
    })

    document.querySelector('[datajs="btn-3"]').addEventListener('click', ({target}) => {
        const textarea = target.parentElement.querySelector('#list-text');
        
        const matchedUl = textarea.value.match(/<ul>/g)?.length === 1;
        const matchedClosingUl = textarea.value.match(/<\/ul>/g)?.length === 1;
        const matchedLi = textarea.value.match(/<li>/g)?.length === 3;
        const matchedClosingLi = textarea.value.match(/<\/li>/g)?.length === 3;
        
        if ([matchedUl, matchedClosingUl, matchedLi, matchedClosingLi].every(item => item)) {
            socket.emit('q3_success', {username: username});
            target.disabled = true;
            document.querySelector('.description.q3').style.color = 'green';
            setTimeout(() => {
                textarea.remove();
                target.remove();
            }, 300);
        } else {
            textarea.value = '';
            target.style.backgroundColor = 'red';
            setTimeout(() => {
                target.style.backgroundColor = '#0DAEAA';
            }, 700);
        }
        
    })

    document.querySelector('[datajs="btn-4"]').addEventListener('click', ({target}) => {
        const box = target.parentElement.querySelector('.color-box');
        const color = window.getComputedStyle( box ,null).getPropertyValue('background-color');
        
        if (color === 'rgb(0, 128, 0)') {
            socket.emit('q4_success', {username: username});
            target.disabled = true;
            document.querySelector('.description.q4').style.color = 'green';
            setTimeout(() => {
                box.remove();
                target.remove();
            }, 300);
        } else {
            box.style.backgroundColor = '#df4a55';
            target.style.backgroundColor = 'red';
            setTimeout(() => {
                target.style.backgroundColor = '#0DAEAA';
            }, 700);
        }
        
    })

    socket.on('startGame', () => {
        const main = document.querySelector('main');
        const notStarted = document.querySelector('.not-started');
    
        notStarted.style.display = 'none';
        main.style.display = 'block';
    });
});

setInterval(() => {
    const button = document.getElementById('btn');
    if (!button) return;

    const randomX = Math.floor(Math.random() * window.innerWidth);
    const randomY = Math.floor(Math.random() * window.innerHeight);
    document.getElementById('btn').style.transform = `translate(${randomX}px, ${randomY}px)`;
}, 1000);

