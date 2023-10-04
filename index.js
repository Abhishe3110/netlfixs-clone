const apikey = "003c5c364b719afc48c145d8a2e4511b";
const apiEndpoints = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const apiPaths = {
  fetchAllCategories: `${apiEndpoints}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) => `${apiEndpoints}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoints}/trending/all/day?api_key=${apikey}&language =en-US`,
  searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}
  &key=AIzaSyCrn0poxCSH0Wm2Z8SFE2SINSWCC4qhTPw`

}


function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
  
}
function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach(category => {
          fetchAndBuildMovieSections(apiPaths.fetchMoviesList(category.id), category.name)
        });
      }
      // console.table(categories)
    })
    .catch(err => console.error(err));
}
function fetchTrendingMovies() {
  fetchAndBuildMovieSections(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
      const randomIndex = parseInt(Math.random() * list.length)
      console.log(list[0]);
      buildBannerSection(list[randomIndex])
    }).catch(err => {
      console.error(err)
    });
}
function buildBannerSection(movie) {
  const bannerCont = document.getElementById('banner-section');
  bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

  const div = document.createElement('div');
  div.innerHTML = `
 <h2 class="banner__title">${movie.title}</h2>
 <p class="banner__info">Treanding in movies | Release Date-${movie.first_air_date}</p>
 <p class="banner__overview">${movie.overview}</p>
 <div class="action-buttons-cont">
   <button class="action-button-play"><i class='bx bx-play'></i>Play</button>
   <button class="action-button"><i class='bx bx-info-circle'></i>&nbsp;&nbsp;More Info</button>
</div>`
  div.className = "banner-content container";
  bannerCont.append(div)
}
function fetchAndBuildMovieSections(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
      // console.table(res.results)
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryName)
      }
      return movies
    })
    .catch(err => console.error(err))
}
function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);
  const moviesCont = document.getElementById('movies-cont');

  const moviesListHTML = list.map(item => {
    return `
      <div class="movie-item" onmouseover="searchMovieTrailer('${item.title}','yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" >
        <iframe  width="250px" height="150px" src="" id ="yt${item.id}"></iframe>
      </div>
    `;
  }).join('');
  
  const moviesSectionHTML = `

    <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
    <div class="movie-row">
      ${moviesListHTML}
     </div>
`

  const div = document.createElement('div');
  div.className = "movies-section"
  div.innerHTML = moviesSectionHTML;
  moviesCont.append(div);
}


// Move the searchMovieTrailer function outside of fetchAndBuildMovieSections
// Move the searchMovieTrailer function outside of fetchAndBuildMovieSections
function searchMovieTrailer(movieName, iframeId) {
  console.log(document.getElementById(iframeId));
  if (!movieName) {
    return;
  }
  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const bestResults = res.items[0];
      if (bestResults) {
        const youtubeUrl = `https://www.youtube.com/embed/${bestResults.id.videoId}?autoplay=1&controls=0`;
        console.log(youtubeUrl);
        const iframeElement = document.getElementById(iframeId);
        iframeElement.src = youtubeUrl;
        iframeElement.style.display = "block";
      }
    })
    .catch((err) => console.error(err));
}
// function searchMovieTrailer(movieName, iframeId) {
//   if (!movieName) {
//     return;
//   }

//   fetch(apiPaths.searchOnYoutube(movieName))
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`YouTube API Request Failed with status: ${res.status}`);
//       }
//       return res.json();
//     })
//     .then((res) => {
//       if (res.items && res.items.length > 0) {
//         const bestResults = res.items[0];
//         const youtubeUrl = `https://www.youtube.com/embed/${bestResults.id.videoId}?autoplay=1&controls=0`;
//         const iframeElement = document.getElementById(iframeId);
//         iframeElement.src = youtubeUrl;
//         iframeElement.style.display = "block";
//       } else {
//         console.error("No valid video ID found.");
//       }
//     })
//     .catch((err) => {
//       console.error("Error fetching or processing YouTube data:", err);
//     });
// }





window.addEventListener('load', function () {
  init();
})