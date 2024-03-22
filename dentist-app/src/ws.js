/* const client = new WebSocket('ws://localhost:3000/ahmed'); */
import { toast } from 'vue3-toastify'
const ws = {}

export const connect = (user_id) => {
  ws.client = new WebSocket(`ws://localhost:3000/${user_id}`)

  ws.client.onmessage = (message) => {
   

    toast(message.data, {
      autoClose: 5000,
      position: toast.POSITION.BOTTOM_RIGHT
    })

    
  }
}

export const disConnect = () => {
  if (ws.client) {
    ws.client.close()
    ws.client = undefined
  }
}
