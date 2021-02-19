var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification(){

  var options = {
    body: 'You successfully subscribed to Notifications',
    icon: 'https://cdn.icon-icons.com/icons2/1506/PNG/512/emblemok_103757.png',
    /* image: '',
    dir: '',
    language: 'en-US',
    vibrate: [100, 50, 200],
    badge: '', */
    tag: 'confirmation-notification',
    renotify: true,
    actions: [
      {
        action: 'confirm',
        title: 'Okay', // quello che viene mostrato
        icon: 'https://static.thenounproject.com/png/161138-200.png'
      },
      {
        action: 'cancel',
        title: 'Cancel', // quello che viene mostrato
        icon: 'https://icons-for-free.com/iconfiles/png/512/cancel-131964784714462788.png'
      }
    ]
  }

  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
      serviceWorkerRegistration.showNotification('Successfully subscribed', options)
    })
  }
  //new Notification('Successfully subscribed', options);
}

function askForNotificationPermission(){
  Notification.requestPermission(function(result){
    console.log('User choise', result);
    if(result !== 'granted'){
      console.log('No notification permission granted');
    }else{
      //displayConfirmNotification()
      configurePushSub();
    }
  });
}

function configurePushSub(){
  var reg;
  navigator.serviceWorker.ready
  .then(function(serviceWorkerRegistration){
    reg = serviceWorkerRegistration;
    return reg.pushManager.getSubscription();
  })
  .then(function(sub){
    if(sub === null){

      var vapidPublicKey = 'BAqxHmpgtIFBKpzI86fEx1ipbLDdJ8CvqIlZnMEXU3-2eR56lMHm4DMkVKVUGrwow_XeM01E2DklxGoH2-KEJ2o'
      var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
      // a subscription not exist. create a new subscription
      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidPublicKey
      });
    }else{
      // already have a subscription
    }
  })
  .then(function(newSub){
    return fetch('https://pwagram-e67f6-default-rtdb.europe-west1.firebasedatabase.app/subscriptions.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newSub)
    })
  })
  .then(function(res){
    if(res.ok){
      displayConfirmNotification();
    }
  })
  .catch(function(err){
    console.log(err);
  })
}

if('Notification' in window && 'serviceWorker' in navigator){
  for(var i = 0; i < enableNotificationsButtons.length; i++){
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission)
  }
}


