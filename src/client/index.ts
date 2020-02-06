import io from 'socket.io-client'

console.log("Hello world")

const socket = io()
let clickCount = 0

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded")
    
    document.querySelector("#testBtn")?.addEventListener("click", () => {
        console.log("btn clicked")
        clickCount++
        socket.on('click-ack', () => {
            console.log("click acknowledged")
        })
        socket.emit('click', `${clickCount}`)                
    })
    //here code
})