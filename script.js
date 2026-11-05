const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 1.2;
canvas.height = window.innerHeight / 1.5;
ctx.fillStyle= 'gray'
ctx.fillRect(0, 0, canvas.width, canvas.height)
