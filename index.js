
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
  updateUIForLoggedInUser();
}

function updateUIForLoggedInUser() {
  if (loginBtn) {
    loginBtn.textContent = "로그아웃";
    loginBtn.removeEventListener("click", toggleModal);
    loginBtn.addEventListener("click", logoutUser);
  }
}

function toggleModal(){
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
}

function logoutUser(){
  localStorage.removeItem("isLoggedIn");
  window.location.reload();
} 

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    updateUIForLoggedInUser();
  }
});

loginBtn.addEventListener('click',toggleModal)

closeBtn.addEventListener('click', toggleModal)

document.addEventListener('keydown',function(e){
  if(e.key === 'Escape' && !modal.classList.contains('hidden')){
    toggleModal();
  }
})



document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  handleSuccessfulLogin(); // Simulate successful login
  modal.classList.add("hidden"); // Close the modal
  overlay.classList.add("hidden"); // Hide the overlay
});



//posters api

function shuffleArraysInSync(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length');
  }

  for (let i = arr1.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements in both arrays
    [arr1[i], arr1[j]] = [arr1[j], arr1[i]];
    [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
  }
}

// Function to create sections with shuffled genres and section classes
async function createSection() {
  const genres = ['액션', '코메디', '멜로드라마','드라마','판타지','SF','어드벤처'];
  const sectionClasses = ['action-section', 'comedy-section', 'romance-section','drama-section','fantasy-section', 'sf-section','adventure-section'];

  shuffleArraysInSync(genres, sectionClasses);

  const sections = document.querySelectorAll('.second-swiper');


  sections.forEach(async (section, index) => {
    const genre = genres[index];
    const sectionClass = sectionClasses[index];

    section.innerHTML = ''; // Clear existing content

    // Set the genre as the section title (h3 element)
    const h3 = document.createElement('h3');
    h3.textContent = genre;
    section.appendChild(h3);

    // Fetch movies by genre and populate swiper slides
    const moviesWithPosters = await fetchDataByGenre(genre);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    moviesWithPosters.forEach((movie) => {
      const posterUrls = movie.posters.split("|").map((url) => url.trim());
      const firstPosterUrl = posterUrls.length > 0 ? posterUrls[0] : null;
      dynamicSlides(firstPosterUrl, sectionClass, movie, swiperWrapper);
    });

    section.appendChild(swiperWrapper);

    const prevButton = document.createElement('div');
    prevButton.classList.add('swiper-button-prev');
    section.appendChild(prevButton);

    const nextButton = document.createElement('div');
    nextButton.classList.add('swiper-button-next');
    section.appendChild(nextButton);

    new Swiper(section, {
      slidesPerView: 6,
      spaceBetween: 0,
      loop: true,
      navigation: {
        nextEl: section.querySelector('.swiper-button-next'),
        prevEl: section.querySelector('.swiper-button-prev'),
      },
    });


  }); 

  
}

createSection()


async function fetchDataByGenre(genre) {
  const apiKey = 'BNUTWI8LOC2C99593QD4';
  const listCount = 20;
  const apiUrl = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&genre=${genre}&sort=prodYear,1&listCount=${listCount}&ServiceKey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const movies = response.data.Data[0].Result;
    const moviesWithPosters = movies.filter(movie => movie.posters !== "");
    return moviesWithPosters;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array or handle error as needed
  }
}


function dynamicSlides(url, sectionClass, movieData, swiperWrapper) {
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const image = document.createElement('img');
  image.src = url;
  image.alt = 'poster';

  cardContent.appendChild(image);
  cardContainer.appendChild(cardContent);
  swiperSlide.appendChild(cardContainer);
  swiperWrapper.appendChild(swiperSlide);

  image.addEventListener('click', () => {
    const movieId = movieData.DOCID;
    if (movieId) {
      window.location.href = `reviewpage.html?id=${encodeURIComponent(movieId)}`;
    } else {
      console.error('No DOCID for this movie', movieData);
    }
  });
}




async function getApiGenres() {
  const apiKey = 'BNUTWI8LOC2C99593QD4';
  const apiUrl = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&genre=&sort=prodYear,1&listCount=1&ServiceKey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    console.log('API Response:', response.data);

    // Check if the response contains a genres field
    if (response.data.genres) {
      console.log('Genres:', response.data.genres);
    } else {
      console.log('Full API response structure:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
}

getApiGenres();