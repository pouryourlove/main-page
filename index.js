
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

function handleSuccessfulLogin() {
  localStorage.setItem('isLoggedIn', 'true');
  updateUIForLoggedInUser;
}

function updateUIForLoggedInUser() {
  if (loginBtn) {
    loginBtn.textContent = "로그아웃";
    loginBtn.removeEventListener("click", function () {
      modal.classList.toggle("hidden");
      overlay.classList.toggle("hidden");
    });
    loginBtn.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      window.location.reload();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    updateUIForLoggedInUser();
  }
});

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



document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  handleSuccessfulLogin(); // Simulate successful login
  modal.classList.add("hidden"); // Close the modal
  overlay.classList.add("hidden"); // Hide the overlay
});

async function fetchDataByGenre(genre, sectionClass){
  const apiKey = 'BNUTWI8LOC2C99593QD4';
  const listCount = 20;
  const apiUrl = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&genre=${genre}&sort=prodYear,1&listCount=${listCount}&ServiceKey=${apiKey}`;

  try{
    const response = await axios.get(apiUrl);
    const movies = response.data.Data[0].Result;

    const moviesWithPosters = movies.filter(movie => movie.posters !== "");

    moviesWithPosters.forEach((movie) => {
      //posters into an array
      const posterUrls = movie.posters.split('|').map(url => url.trim());
      const firstPosterUrl = posterUrls.length>0?posterUrls[0]:null;
      dynamicSlides(firstPosterUrl,sectionClass,movie)
    });

    const secondSwiper = new Swiper(".second-swiper", {
      slidesPerView: 6,
      spaceBetween: 0,
      loop: true,
      navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
      },
    });
  }catch(error){
    console.log(error)
  }
}

function dynamicSlides(url, sectionClass,movieData){
  const swiperWrapper = document.querySelector(`.${sectionClass} .swiper-wrapper`);
   // Create swiper slide element
   const swiperSlide = document.createElement('div');
   swiperSlide.classList.add('swiper-slide');
 
   // Create card container
   const cardContainer = document.createElement('div');
   cardContainer.classList.add('card-container');
 
   // Create card content
   const cardContent = document.createElement('div');
   cardContent.classList.add('card-content');
 
   // Create image element
   const image = document.createElement('img');
   image.src = url;
   image.alt = 'poster';
 
   // Append image to card content
   cardContent.appendChild(image);
 
   // Append cardContent to card container
   cardContainer.appendChild(cardContent);
 
   // Append cardContainer to swiperSlide
   swiperSlide.appendChild(cardContainer);
 
   // Append swiperSlide to swiper wrapper
   swiperWrapper.appendChild(swiperSlide);

   image.addEventListener('click',()=>{
    const movieId = movieData.DOCID;
    if(movieId){
      window.location.href = `reviewpage.html?id=${encodeURIComponent(movieId)}`
    } else {
      console.error('No DOCID for this movie', movieData)
    }
   })

}

fetchDataByGenre('액션', 'action-section'); // Fetch action genre posters
fetchDataByGenre('코메디', 'comedy-section'); // Fetch comedy genre posters
fetchDataByGenre('멜로드라마', 'romance-section'); // Fetch romance genre posters


