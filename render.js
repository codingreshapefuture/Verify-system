class CertData {
    constructor() {
        this.dataUrl = './datasheet.json';
        this.validIds = [];
        this.urlParams = new URLSearchParams(window.location.search);
        this.codeId = this.urlParams.get('id');
        this.resource = document.getElementById('certImg');
        this.error = document.getElementById('error-message');
        this.data = null;
        this.course = '';
        this.id = '';
        this.certURL = '';
    }

    async loadData() {
        // Get the ID parameter from the URL
        const response = await fetch(this.dataUrl);
        const loadData = await response.json();
        this.validIds = Object.keys(loadData);
        return loadData;
    }

    async verifyData() {
        // verify the parameter from url
        var regex = /^([a-zA-Z]{3})(\d+)$/;
        var matches = this.codeId.match(regex);
        if (matches) {
            this.course = matches[1];
            this.id = matches[2];
            return true;
        } else {
            return false;
        }
    }

    async renderPDF(url) {
        // Đặt workerSrc để tránh lỗi "Deprecated API usage"
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const canvas = document.getElementById("pdfViewer");
                const context = canvas.getContext("2d");

                // Lấy kích thước của section.certificate
                const container = document.querySelector("section.certificate");
                const containerWidth = container.clientWidth;

                // Xác định tỷ lệ scale dựa trên container width
                const viewport = page.getViewport({ scale: 1 });
                const scale = containerWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale });

                // Thiết lập kích thước canvas phù hợp với section.certificate
                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;

                // Render PDF với kích thước đã điều chỉnh
                const renderContext = { canvasContext: context, viewport: scaledViewport };
                page.render(renderContext);
            });
        }).catch(error => {
            console.error("Error rendering PDF:", error);
            this.error.style.display = 'block';
        });
    }

    // Load the data source file and render the certificate image
    async renderData() {
        // Check if the ID is valid
        if (this.validIds.includes(this.codeId) && this.verifyData()) {
            // Extract the cert data and other info from the data source file
            const renderData = this.data[this.codeId];
            // Cập nhật thông tin tiêu đề và mô tả chứng chỉ
            document.getElementById("courseTitle").textContent = renderData.courseTitle;
            document.getElementById("certifiedName").textContent = renderData.certifiedName;
            // Get final data string from course and id
            const finalData = `${this.course.toUpperCase()}/Certificates/${atob(renderData.certData)}`; // /<course>/Certificates/<cert-path>.pdf
            // Add the data parameter to the URL if it is not already present
            const checkData = renderData.certData.slice(-20, -5); // ?id=<uuid>&data=<encoded>
            if (this.urlParams.get('data') != checkData) {
                this.urlParams.set("data", checkData)
                window.location.search = this.urlParams;
            }
            // Get the path to the certificate image
            const currentPath = window.location.origin + window.location.pathname; // http://<url>/verify.html
            const folderPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1); // http://<url>/
            const fullPath = folderPath.endsWith('/') ? folderPath + finalData : folderPath + '/' + finalData;

            // Dùng PDF.js để render file PDF
            this.renderPDF(fullPath);

            // Fetch PDF và tạo một Blob object cho download
            const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            this.certURL = URL.createObjectURL(blob);
            return this.certURL;
        } else {
            // Display an error message if there is an error loading the data source file
            this.error.style.display = 'block';
            document.getElementById("pdfViewer").style.display = "none";
            if (this.urlParams.get('data')) {
                this.urlParams.delete('data');
                var newUrl = `${window.location.pathname}?${this.urlParams.toString()}`;
                window.history.replaceState(null, null, newUrl);
            }
            console.error("Load failed!")
            return null;
        }
    }

    async init() {
        // Load the contents of the data source file into the validIds variable
        this.data = await this.loadData();
        return this.renderData()
    }
}

// Create an instance of the CertData class and load and render the certificate image
let certData = new CertData();
let certDataURL = certData.init();
