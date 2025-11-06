// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-in');
    const searchBar = document.querySelector('.search-bar');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBar) {
        // Add active class when input is focused
        searchInput.addEventListener('focus', () => {
            searchBar.classList.add('search-active');
        });

        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                searchBar.classList.remove('search-active');
            }
        });

        // Live search as user types
        searchInput.addEventListener('input', performSearch);
        
        // Handle form submission
        searchBar.closest('form').addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    function performSearch() {
        const searchQuery = searchInput.value.toLowerCase().trim();
        const listingCards = document.querySelectorAll('.listing-card');
        let matchCount = 0;

        listingCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const location = card.querySelector('.text-muted')?.textContent.toLowerCase() || '';
            const matches = title.includes(searchQuery) || location.includes(searchQuery);
            
            const container = card.closest('.col');
            if (container) {
                container.style.display = matches ? '' : 'none';
                if (matches) matchCount++;
            }
        });

        // Update search bar status
        if (searchQuery) {
            searchBtn.setAttribute('data-results', matchCount);
            searchBar.classList.add('has-results');
            searchBar.setAttribute('data-results', `${matchCount} result${matchCount !== 1 ? 's' : ''}`);
        } else {
            searchBar.classList.remove('has-results');
            searchBtn.removeAttribute('data-results');
        }
    }
});