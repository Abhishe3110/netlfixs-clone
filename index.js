const apikey = "003c5c364b719afc48c145d8a2e4511b"; 
const apiEndpoints = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const apiPaths = {
  fetchAllCategories: `${apiEndpoints}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList:(id)=>`${apiEndpoints}/discover/movie?api_key=${apikey}&with_genres=${id}`
}


function init(){
  fetchAndBuildAllSections();
}
function fetchAndBuildAllSections(){
  fetch(apiPaths.fetchAllCategories)
  .then(res => res.json())
  .then(res => {
    const categories = res.genres;
    if(Array.isArray(categories)&&categories.length){
      categories.forEach(category =>{
        fetchAndBuildMovieSections(apiPaths.fetchMoviesList(category.id),category)
      });
    }
    // console.table(categories)
  })
  .catch(err => console.error(err));
}
function fetchAndBuildMovieSections(fetchUrl,category){
console.log(fetchUrl,category);
fetch(fetchUrl)
.then(res=>res.json())
.then(res=>
  {
    // console.table(res.results)
  const movies = res.results;
  if(Array.isArray(movies)&&movies.length){
    buildMoviesSection(movies.slice(0,10),category.name)
  }

})
.catch(err=>console.error(err))
}
function buildMoviesSection(list,categoryName){
  console.log(list,categoryName);
  const moviesCont = document.getElementById('movies-cont');

  const moviesListHTML = list.map(item=>{
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
  div.innerHTML  = moviesSectionHTML;
  moviesCont.append(div);
}

window.addEventListener('load',function(){
  init();
})
