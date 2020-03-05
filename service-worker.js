const cacheName="myfirstcache";
const appFiles=[
	"/manifest.json",
	"/js/scripts.js",
	"/css/stylesheet.css",
	"/images/yes.gif",
];




self.addEventListener("install",(installing)=>{
    console.log("Service Worker: I am being installed, hello world!");


  installing.waitUntil(
    caches.open(cacheName).then((cache)=>{
      console.log("Service Worker: Caching important offline files");
      return cache.addAll(appFiles);
    })
  );
  //this fucker down here
});


  self.addEventListener("activate",(activating)=>{
    console.log("Service Worker: All systems online, ready to go!");
  });

  self.addEventListener("fetch",(fetching)=>{
    console.log("Service Worker: User threw a ball, I need to fetch it!");
  });

  self.addEventListener("push",(pushing)=>{
      console.log("Service Worker: I received some push data, but because I am still very simple I don't know what to do with it :(");
  })
