document.addEventListener("DOMContentLoaded", async function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchResults = document.getElementById("searchResults");

    let data = {};

    // Tải dữ liệu từ datasheet.json
    async function loadData() {
        try {
            const response = await fetch("./datasheet.json");
            data = await response.json();
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    }
    await loadData();

    // Tìm kiếm theo ID, khóa học hoặc tên người
    function search(query) {
        query = query.toLowerCase();
        let results = [];

        for (let id in data) {
            let courseTitle = data[id].courseTitle;
            let certifiedName = data[id].certifiedName;

            if (id.toLowerCase().includes(query) || courseTitle.toLowerCase().includes(query) || certifiedName.toLowerCase().includes(query)) {
                results.push({ id, courseTitle, certifiedName });
            }
        }
        return results;
    }

    // Cập nhật danh sách kết quả
    function updateDropdown(results) {
        searchResults.innerHTML = "";
        if (results.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        results.forEach(result => {
            let option = document.createElement("option");
            option.value = result.id;
            option.textContent = `${result.certifiedName} - ${result.courseTitle} (${result.id})`;
            searchResults.appendChild(option);
        });
        searchResults.style.display = "block";
    }

    // Xử lý khi nhập vào ô tìm kiếm
    searchInput.addEventListener("input", function () {
        let query = searchInput.value.trim();
        if (query.length > 0) {
            let results = search(query);
            updateDropdown(results);
        } else {
            searchResults.style.display = "none";
        }
    });

    // Chọn kết quả từ dropdown
    searchResults.addEventListener("change", function () {
        searchInput.value = searchResults.value; // Cập nhật ô tìm kiếm với ID đã chọn
        searchResults.style.display = "none";
    });

    // Khi nhấn nút tìm kiếm
    searchButton.addEventListener("click", function () {
        let selectedId = searchInput.value.trim();
        if (data[selectedId]) {
            window.location.href = `?id=${selectedId}`;
        } else {
            alert("Không tìm thấy chứng chỉ!");
        }
    });
});
