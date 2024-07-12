
const firstSwiper = new Swiper(".first-swiper", {
  // Optional parameters
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".custom-next-button-first",
    prevEl: ".custom-prev-button-first",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});






// modal

const loginBtn = document.querySelector('#openLoginModal');
const modal = document.querySelector('.loginModal');
const closeBtn = document.querySelector('.close');
const overlay = document.querySelector('.overlay');

loginBtn.addEventListener('click',function(){
  modal.classList.toggle('hidden')
  overlay.classList.toggle('hidden')
})

closeBtn.addEventListener('click', function(){
  modal.classList.toggle('hidden')
  overlay.classList.toggle('hidden')
})

document.addEventListener('keydown',function(e){
  if(e.key === 'Escape' && !modal.classList.contains('hidden')){
    modal.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
  }
})

document.getElementById('login-form').addEventListener('submit', async function(e){
  e.preventDefault();
  const form = document.getElementById('login-form')
  const formData = new FormData(form);

  //send post request
  try {
    const response = await axios.post("/signin", formData);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  
})

//poster api - 액션장르

async function fetchActionData() {
  const apiKey = 'BNUTWI8LOC2C99593QD4';
  const listCount = 20;
  const apiUrl = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&genre=액션&sort=prodYear,1&listCount=${listCount}&ServiceKey=${apiKey}`;
  
  try {
    const response = await axios.get(apiUrl);
    const movies = response.data.Data[0].Result;

    const moviesWithPosters = movies.filter(movie => movie.posters !== "")


    moviesWithPosters
    .forEach((movie)=>{
      //posters into an array
      const posterUrls = movie.posters.split('|').map(url=>url.trim());
      const firstPosterUrl = posterUrls.length > 0 ? posterUrls[0] : null;
      console.log(firstPosterUrl)
      dynamicSlides(firstPosterUrl)
    })

    const secondSwiper = new Swiper(".second-swiper", {
      slidesPerView: 6,
      spaceBetween: 0,
      loop: true,
      navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
      },
    });
    
    
    // Process the response data as needed
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle errors
  }
}

function dynamicSlides(url){
  const swiperWrapper = document.querySelector('.action-section .swiper-wrapper');

  //create swiper slide element
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');

  //create card container
  const cardContainer = document.createElement('div')
  cardContainer.classList.add('card-container');

  //create card content
  const cardContent = document.createElement('div')
  cardContent.classList.add('card-content')

  //create image element
  const image = document.createElement('img');
  image.src = url; 
  image.alt = 'poster'

  //append image to card content
  cardContent.appendChild(image);

  //append cardContent to card container
  cardContainer.appendChild(cardContent);

  //append cardContainer to swiperSlide
  swiperSlide.appendChild(cardContainer)

  //append swiperSlide to swiper wrapper
  swiperWrapper.appendChild(swiperSlide)

  
}

fetchActionData();

//poster api - 코미디