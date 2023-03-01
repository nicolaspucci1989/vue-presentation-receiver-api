<script setup>
import { ref } from 'vue'

const presentationRequest = new PresentationRequest(['receiver/index.html'])

// Make this presentation the default one when using the "Cast" browser menu.
navigator.presentation.defaultRequest = presentationRequest

let presentationConnection

const message = ref('')
const presentationId = ref('')
function start() {
  console.log('Starting presentation request...')
  presentationRequest
    .start()
    .then((connection) => {
      console.log('> Connected to ' + connection.url + ', id: ' + connection.id)
    })
    .catch((error) => {
      console.log('> ' + error.name + ': ' + error.message)
    })
}

presentationRequest.addEventListener('connectionavailable', function (event) {
  presentationConnection = event.connection
  presentationConnection.addEventListener('close', function () {
    console.log('> Connection closed.')
  })
  presentationConnection.addEventListener('terminate', function () {
    console.log('> Connection terminated.')
  })
  presentationConnection.addEventListener('message', function (event) {
    console.log('> ' + event.data)
  })
})

function sendMessage() {
  const lang = document.body.lang || 'en-US'

  console.log('Sending "' + message.value + '"...')
  presentationConnection.send(JSON.stringify({ message: message.value, lang }))
}

function close() {
  console.log('Closing connection...')
  presentationConnection.close()
}

function terminate() {
  console.log('Terminating connection...')
  presentationConnection.terminate()
}

function reconnect() {
  presentationRequest
    .reconnect(presentationId)
    .then((connection) => {
      console.log('Reconnected to ' + connection.id)
    })
    .catch((error) => {
      console.log('Presentation.reconnect() error, ' + error.name + ': ' + error.message)
    })
}

/* Availability monitoring */

presentationRequest
  .getAvailability()
  .then((availability) => {
    console.log('Available presentation displays: ' + availability.value)
    availability.addEventListener('change', function () {
      console.log('> Available presentation displays: ' + availability.value)
    })
  })
  .catch((error) => {
    console.log('Presentation availability not supported, ' + error.name + ': ' + error.message)
  })
</script>

<template>
  <p>
    <button id="start" @click="start">presentationRequest.start()</button>
  </p>
  <p>
    <input
      v-model="message"
      id="message"
      type="text"
      placeholder="Enter a message..."
      list="fruits"
    />
    <datalist id="fruits">
      <option value="grapes"></option>
      <option value="watermelon"></option>
      <option value="melon"></option>
      <option value="tangerine"></option>
      <option value="lemon"></option>
      <option value="banana"></option>
      <option value="pineapple"></option>
      <option value="green apple"></option>
      <option value="apple"></option>
      <option value="pear"></option>
      <option value="peach"></option>
      <option value="cherries"></option>
      <option value="strawberry"></option>
    </datalist>

    <button id="sendMessage" @click="sendMessage">presentationConnection.send(message)</button>
  </p>
  <p>
    <button id="close" @click="close">presentationConnection.close()</button>
    <button id="terminate" @click="terminate">presentationConnection.terminate()</button>
  </p>
  <p>
    <input
      v-model="presentationId"
      id="presentationId"
      type="text"
      placeholder="Enter a presentation ID..."
    />
    <button id="reconnect" @click="reconnect">presentationRequest.reconnect(presentationId)</button>
  </p>
</template>
