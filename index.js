const apikey = "003c5c364b719afc48c145d8a2e4511b"; 
const apiEndpoints = "https://api.themoviedb.org/3";
const apiPaths = {
  fetchAllCategories: `${apiEndpoints}/genre/movie/list?api_key=${apikey}`,
  fetchMoviesList:(id)=>`${baseUrl}/discover/movie?api_key=${apikey}&with_genres=${id}`
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
}

window.addEventListener('load',function(){
  init();
})