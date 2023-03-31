// check if windows in mobile mode < 800px
if (window.innerWidth < 800) {
    const searchIcon = document.querySelector('.mobile-menu .search')
    const menuIcon  = document.querySelector('.mobile-menu .menu')
    const searchBar = document.querySelector('.search-container')
    const menuBar = document.querySelector('nav ul')
    // on click search icon, toggle search bar
    searchIcon.addEventListener('click', () => {
        searchBar.classList.toggle('show')
    })
    // on click menu icon, toggle menu bar
    menuIcon.addEventListener('click', () => {
        menuBar.classList.toggle('show')
    })
}