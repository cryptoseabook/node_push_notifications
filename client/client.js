const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";


$(document).ready(function() {
  // Check for service worker
  if ("serviceWorker" in navigator) {
    register()

    // Register Push
    $('#subscribe').click(function() {
      subscribe()
    })

    $('#send').click(function() {
      send()
    })
  }
})

async function send() {
  console.log("Sending ....")

  await fetch("/api/sendMessage", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    }
  });

  console.log("Sent...");
}

async function subscribe() {
  console.log("Registering Push...");
  let subscription = await register.pushManager.subscribe({ 
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await fetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json"
    }
  });

  console.log("Push Registered...");
}

// Register SW, Register Push, Send Push
async function register() {
  // Register Service Worker
  console.log("Registering service worker...");
  register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/"
  });
  console.log("Service Worker Registered...");
}


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
