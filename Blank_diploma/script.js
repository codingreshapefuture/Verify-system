// check if windows in mobile mode < 800px
if (window.innerWidth < 800) {
    const searchIcon = document.querySelector('.mobile-menu .search')
    const menuIcon = document.querySelector('.mobile-menu .menu')
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

const dialog = document.querySelector('.dialog')
const downloadBtn = document.querySelector('.download')
const shareBtn = document.querySelector('.share')
const closeBtn = document.querySelector('.close')
const dialogInput = document.querySelector('.dialog-body input')

// handle popup dialog
function popupDialog(title, message, button) {
    document.querySelector('.dialog-title h3').textContent = title
    document.querySelector('.dialog-body p').textContent = message
    document.querySelector('.dialog-body button').textContent = button
}
function shareURL() {
    var currentURL = window.location.href;
    // Hiển thị URL trên trang
    dialogInput.value = currentURL;
    document.querySelector('.dialog-body button').addEventListener("click", () => {
        // Kiểm tra xem trình duyệt có hỗ trợ clipboard hay không
        if (navigator.clipboard) {
            navigator.clipboard.writeText(currentURL)
                .then(function () {
                    alert("URL đã được sao chép vào clipboard!");
                })
                .catch(function () {
                    alert("Sao chép URL thất bại.");
                });
        }
    })
}
function downloadURL() {
    var pathData = certData.renderData();
    if (pathData == null) {
        dialogInput.value = '';
        return
    }
    document.querySelector('.dialog-body button').addEventListener("click", () => {
        // Hiển thị URL trên trang
        const currentPath = window.location.origin + window.location.pathname;
        const folderPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const fullPath = folderPath.endsWith('/') ? folderPath + pathData : folderPath + '/' + pathData;
        // Fetch PDF và tạo một Blob object
        fetch(fullPath)
            .then(response => response.blob())
            .then(blob => {
                // Tạo một URL đến Blob
                const url = URL.createObjectURL(blob);
                dialogInput.value = url;
                // Mở file PDF trong tab mới
                window.open(url, '_blank');
            });
    })
}
// on click download button, toggle dialog
downloadBtn.addEventListener('click', () => {
    dialog.classList.toggle('show')
    popupDialog(
        'Download Certificate',
        'Enter your email address to receive a printout of your certificate.',
        'Download'
    )
    dialogInput.value = '';
    downloadURL();
})
// on click share button, toggle dialog
shareBtn.addEventListener('click', () => {
    dialog.classList.toggle('show')
    popupDialog(
        'Share Certificate',
        'Share your certificate with friends to prove your competence.',
        'Share'
    )
    dialogInput.value = '';
    shareURL();
})
// on click close button, toggle dialog
closeBtn.addEventListener('click', () => {
    dialog.classList.toggle('show')
})
