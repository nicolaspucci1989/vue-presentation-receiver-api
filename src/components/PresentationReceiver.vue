<script setup>
import { onMounted, reactive } from 'vue'

let connectionIdx = 0
let messageIdx = 0
const messages = reactive([])
function addConnection(connection) {
  connection.connectionId = ++connectionIdx
  addMessage('New connection #' + connectionIdx)

  connection.addEventListener('message', function (event) {
    messageIdx++
    const data = JSON.parse(event.data)
    const logString =
      'Message ' + messageIdx + ' from connection #' + connection.connectionId + ': ' + data.message
    addMessage(logString, data.lang)
    maybeSetFruit(data.message)
    connection.send('Received message ' + messageIdx)
  })

  connection.addEventListener('close', function (event) {
    addMessage(
      'Connection #' +
        connection.connectionId +
        ' closed, reason = ' +
        event.reason +
        ', message = ' +
        event.message
    )
  })
}

/* Utils */

const fruitEmoji = {
  grapes: '\u{1F347}',
  watermelon: '\u{1F349}',
  melon: '\u{1F348}',
  tangerine: '\u{1F34A}',
  lemon: '\u{1F34B}',
  banana: '\u{1F34C}',
  pineapple: '\u{1F34D}',
  'green apple': '\u{1F35F}',
  apple: '\u{1F34E}',
  pear: '\u{1F350}',
  peach: '\u{1F351}',
  cherries: '\u{1F352}',
  strawberry: '\u{1F353}'
}

function addMessage(content) {
  messages.push({ content })
}

function maybeSetFruit(message) {
  const fruit = message.toLowerCase()
  if (fruit in fruitEmoji) {
    messages.push({ content: fruitEmoji[fruit] })
  }
}

onMounted(() => {
  if (navigator.presentation.receiver) {
    navigator.presentation.receiver.connectionList.then((list) => {
      list.connections.map((connection) => addConnection(connection))
      list.addEventListener('connectionavailable', function (event) {
        addConnection(event.connection)
      })
    })
  }
})
</script>

<template>
  <div id="">Hello World</div>
  <ul id="message-list">
    <li v-for="(msg, n) in messages" :key="n">{{ msg.content }}</li>
  </ul>
</template>

<style scoped>
#main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 54px;
}
</style>
