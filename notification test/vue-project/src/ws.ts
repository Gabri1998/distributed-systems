
const client = new WebSocket('ws://localhost:3000/ahmed');

/* client.on('open', () => {
  // Causes the server to print "Hello"
  client.send('Hello');
}); */
client.onmessage =(message)=>{
    alert(message.data)
    
}

