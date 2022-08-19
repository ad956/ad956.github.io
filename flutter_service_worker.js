'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "d043e6081ddc472be171653534c46d2c",
"assets/assets/bike.gif": "24d2a2565416b44dc9c59f09057aa320",
"assets/assets/contact.jpg": "923d25c5a9ef5fcebbbdd79aefc45779",
"assets/assets/files/data.json": "48bfadbe4a42e0b38e968cf267cae18c",
"assets/assets/fonts/Splash-Regular.ttf": "25b4b5aef6e0296737504c409586a107",
"assets/assets/heart.gif": "444cd2a60742e2f37ed81e7867e70ba8",
"assets/assets/icon.gif": "0555b6ad590db53a932bee2f7344e1eb",
"assets/assets/icons/android.png": "ad9c2e86e01cbcfe3956c2908fea996b",
"assets/assets/icons/css.png": "f8a61124ccd4a66aa848ef4e16185d00",
"assets/assets/icons/fb.png": "5d6ea38a769498dfc19fe6389d14db39",
"assets/assets/icons/flutter.png": "aff1fb8ba9ba16a0260d71c72b1417aa",
"assets/assets/icons/git.png": "472739dfb5857b1f659f4c4c6b4568d0",
"assets/assets/icons/gitDark.png": "ef7a02b69836dc8b6a732a54c4200dcb",
"assets/assets/icons/html.png": "8c9578f8016470ebaaba2e604958d030",
"assets/assets/icons/insta.png": "407e60285c44463b5344819901d10f57",
"assets/assets/icons/java.png": "c5987fce651da814216e50d4d2469088",
"assets/assets/icons/js.png": "efef7da8b48ca5e24cfe4474fc49b611",
"assets/assets/icons/node.png": "a53712645ccc895ad663e7ac0e5493e0",
"assets/assets/icons/python.png": "6d4c9e139e588c951697aca0fa2c4873",
"assets/assets/icons/react.png": "0c20fd153b78313468b350c6400d3716",
"assets/assets/icons/sql.png": "f34dae8e26f515f95f6372e330440407",
"assets/assets/icons/tweet.png": "7571ea13179d06d922f912f64d14abc6",
"assets/assets/login.jpg": "ce32a3217aa55a07db49b47f49ac871c",
"assets/assets/mypc.jpg": "34b63d07b6b174e4caceedb7cd7d3d15",
"assets/FontManifest.json": "9bc74119106fa60c07f7405da8083faf",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "f3da0b1508b813fd3e66724ca3621877",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "d1722d5cf2c7855862f68edb85e31f88",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "613e4cc1af0eb5148b8ce409ad35446d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "dd3c4233029270506ecc994d67785a37",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "4efff3811b4f1b225ed07d35396a1c13",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icon.gif": "0555b6ad590db53a932bee2f7344e1eb",
"icons/Icon-192.png": "6a293ef26a46e9489388dd1f7abe1a8a",
"icons/Icon-512.png": "6f21ad81961d825b4c172e5eec1f240a",
"icons/Icon-maskable-192.png": "6a293ef26a46e9489388dd1f7abe1a8a",
"icons/Icon-maskable-512.png": "6f21ad81961d825b4c172e5eec1f240a",
"index.html": "ee5644e06b72065d7e062392644925dd",
"/": "ee5644e06b72065d7e062392644925dd",
"main.dart.js": "49b7aea4b1710c7c16fedc4ed5514309",
"manifest.json": "4c1321a0002601686cd26e812c117f90",
"version.json": "009c9e65172e010890f7f65fde438006"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
