const apikey = "003c5c364b719afc48c145d8a2e4511b";
const apiEndpoints = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const apiPaths = {
  fetchAllCategories: `${apiEndpoints}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList: (id) => `${apiEndpoints}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoints}/trending/all/day?api_key=${apikey}&language =en-US`
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
  .then(list=>{
    const randomIndex = parseInt(Math.random()*list.length)
    console.log(list[0]);
    buildBannerSection(list[randomIndex])
  }).catch(err=>{
    console.error(err)
  });
}
function buildBannerSection(movie){
 const bannerCont = document.getElementById('banner-section'); 
 bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

 const div= document.createElement('div');
 div.innerHTML = `
 <h2 class="banner__title">${movie.title}</h2>
 <p class="banner__info">Treanding in movies | Release Date-${ movie.first_air_date}</p>
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
        buildMoviesSection(movies.slice(0, 10), categoryName)
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
    <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
    `
  }).join('')
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

window.addEventListener('load', function () {
  init();
})
