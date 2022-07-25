
function randomWord(dict){
   var length = dict.length;

   var randomNumer = Math.floor((Math.random() * (length - 1))+1);

   return dict[randomNumer];
}

const myFunction = function (a, b) {return a * b}
class PhotoGallery{
  constructor(){
    this.API_KEY = '';
    this.galleryDIv = document.querySelector('.gallery');
    this.loadMore = document.querySelector('.load-more');
    this.logo = document.querySelector('.logo')
    this.pageIndex = 1;
    this.searchValueGlobal = '';
    this.eventHandle();
  }

  eventHandle(){
    document.addEventListener('DOMContentLoaded',()=>{
      this.getImg(1);
    });
    this.loadMore.addEventListener('click', (e)=>{
      this.loadMoreImages(e);
    })
    this.logo.addEventListener('click',(e)=>{
      this.pageIndex = 1;
      this.galleryDIv.innerHTML = '';
      
      this.getSearchedImages(e);
    })
  }


  async getWord(wordToTranslate) {
    const response = await fetch('https://www.latin-is-simple.com/api/vocabulary/search/?format=json&forms_only=false&query='+wordToTranslate);
    const data = await response.json();
    console.log(data[0].short_name);
    document.getElementById('word').textContent = data[0].short_name
  }


  async getImg(index){
    this.loadMore.setAttribute('data-img', 'curated');
    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos)
    console.log(data)
  }
  async fetchImages(baseURL){
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: this.API_KEY
      }
    });
    const data = await response.json();
    // console.log(data);
    return data;
  }
  GenerateHTML(photos){
    photos.forEach(photo=>{
      const item= document.createElement('div');
      item.classList.add('item');
      item.innerHTML = `
      <a href='${photo.src.original}' target="_blank">
        <img src="${photo.src.medium}">
        <h3>${photo.photographer}</h3>
      </a>
      `;
      this.galleryDIv.appendChild(item)
    })
  }  
  
  async getSearchedImages(e){
    e.preventDefault();
    this.galleryDIv.innerHTML='';
    const searchValue = randomWord(dictionary_english);
    console.log(searchValue)
    this.searchValueGlobal = searchValue;
    document.getElementById('eword').textContent = searchValue
    this.getWord(searchValue)
    const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos);
  }
  async getMoreSearchedImages(index){
    // console.log(searchValue)
    const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
    const data = await this.fetchImages(baseURL);
    console.log(data)
    this.GenerateHTML(data.photos);
  }
  loadMoreImages(e){
    let index = ++this.pageIndex;
    const loadMoreData = e.target.getAttribute('data-img');
    if(loadMoreData === 'curated'){
      // load next page for curated]
      this.getImg(index)
    }else{
      // load next page for search
      this.getMoreSearchedImages(index);
    }
  }

}

const gallery = new PhotoGallery;