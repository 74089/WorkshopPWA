//See if the browser supports Service Workers, if so try to register one
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js").then(function(registering){
      // Registration was successful
      console.log("Browser: Service Worker registration is successful with the scope",registering.scope);
    }).catch(function(error){
      //The registration of the service worker failed
      console.log("Browser: Service Worker registration failed with the error",error);
    });
  }else { 
    //The registration of the service worker failed
    console.log("Browser: I don't support Service Workers :(");
  }

  //Asking for permission with the Notification API
if(typeof Notification!==typeof undefined){ //First check if the API is available in the browser
	Notification.requestPermission().then(function(result){
		//If accepted, then save subscriberinfo in database
		if(result==="granted"){
			console.log("Browser: User accepted receiving notifications, save as subscriber data!");
			navigator.serviceWorker.ready.then(function(serviceworker){ //When the Service Worker is ready, generate the subscription with our Serice Worker's pushManager and save it to our list
				const VAPIDPublicKey="BDomArd8DJSCcbgW6iNvsGCIqhiXZ0ef_0tiYrNPt6RTYZYQcihsr0_e6_KqZ7M3XqbIU6pTPAIV80pl1XtrkA4"; // Fill in your VAPID publicKey here
				const options={applicationServerKey:VAPIDPublicKey,userVisibleOnly:true} //Option userVisibleOnly is neccesary for Chrome
				serviceworker.pushManager.subscribe(options).then((subscription)=>{
          //POST the generated subscription to our saving script (this needs to happen server-side, (client-side) JavaScript can't write files or databases)
					let subscriberFormData=new FormData();
					subscriberFormData.append("json",JSON.stringify(subscription));
					fetch("data/saveSubscription.php",{method:"POST",body:subscriberFormData});
				});
			});
		}
	}).catch((error)=>{
		console.log(error);
	});
}


//custom install prompt
let installPrompt;
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;

  const installbutton = document.getElementById('installbutton');
  installbutton.style.display = "block";

  installbutton.addEventListener("click", event => {
    installPrompt.prompt();

    installbutton.style.display = "none";

    installPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome !== "accepted") {
        installbutton.style.display = "block";
      }
      installPrompt = null;
    });
  });
});

// Install hint for iOS
//iOS install tip show
const isIOSUsed=()=>{
  const userAgent=window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent); //Return if iOS is used (iPhone, iPod or iPad)
}

const standaloneModeActive=()=>("standalone" in window.navigator)&&(window.navigator.standalone); //Will be true if the PWA is used
if(isIOSUsed()&&!standaloneModeActive()){
  //Show your install tip for iOS here
}
