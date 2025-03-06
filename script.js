const API_KEY = '-Di_223hyM8As63OYIfmzwSlcXkEK_6dIOkNYqB3hQY'; // Replace with your Unsplash API key
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const imageGrid = document.getElementById('image-grid');
const loading = document.getElementById('loading');

let currentPage = 1;
let currentQuery = '';

async function fetchImages(query, page = 1) {
    try {
        loading.classList.remove('hidden');
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=12&client_id=${API_KEY}`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    } finally {
        loading.classList.add('hidden');
    }
}

function createImageCard(imgData) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
        <img src="${imgData.urls.regular}" alt="${imgData.alt_description}">
        <div class="image-info">
            <p>By ${imgData.user.name}</p>
        </div>
    `;
    return card;
}

async function loadMoreImages() {
    currentPage++;
    const images = await fetchImages(currentQuery, currentPage);
    images.forEach(img => imageGrid.appendChild(createImageCard(img)));
}

function handleSearch() {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    imageGrid.innerHTML = '';
    
    if (currentQuery) {
        fetchImages(currentQuery).then(images => {
            images.forEach(img => imageGrid.appendChild(createImageCard(img)));
        });
    }
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Infinite Scroll
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreImages();
    }
});

// Initial load with default search
fetchImages('technology').then(images => {
    images.forEach(img => imageGrid.appendChild(createImageCard(img)));
});