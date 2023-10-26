

document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "35c2315d9ba90a7ad4f59d92e8aa7ae7";
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("resultsContainer");

  searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value;

    // Effectuer la recherche à l'API TMDb
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Traiter les résultats, y compris les images
        const resultsHTML = data.results
          .map((result) => {
            return `
            <div class="film__card">
              <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title} Poster">
              <div class="content">
                <h2>${result.title}</h2>

              </div>
              
            </div>
          `;
          })
          .join("");

        // Afficher les résultats dans l'élément resultsContainer
        resultsContainer.innerHTML = resultsHTML;
      })
      .catch((error) => console.error("Erreur lors de la recherche :", error));
  });
});

// <p>${result.overview}</p>

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response("Network error ...", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "/fallback.html",
    })
  )
})