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
    var shareURL = window.location.href;
    // Hiển thị URL trên trang
    dialogInput.value = shareURL;
    document.querySelector('.dialog-body button').addEventListener("click", () => {
        // Kiểm tra xem trình duyệt có hỗ trợ clipboard hay không
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareURL)
                .then(function () {
                    alert("URL đã được sao chép vào clipboard!");
                })
                .catch(function () {
                    alert("Sao chép URL thất bại.");
                });
        }
    })
}
async function downloadURL() {
    var downloadURL = await certDataURL;
    // Hiển thị URL trên trang
    if (downloadURL == null) {
        dialogInput.value = '';
        return
    } else {
        dialogInput.value = downloadURL.slice(5);
    }
    document.querySelector('.dialog-body button').addEventListener("click", () => {
        // Mở file PDF trong tab mới
        window.open(downloadURL, '_blank');
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
