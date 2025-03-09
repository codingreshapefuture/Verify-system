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

    // Load the data source file and render the certificate image
    async renderData() {
        // Check if the ID is valid
        if (this.validIds.includes(this.codeId) && this.verifyData()) {
            // Use Google Docs preview to avoid auto download PDF
            const previewer = "https://docs.google.com/gview?embedded=true&url="
            // Extract the image data from the data source file
            const renderData = this.data[this.codeId];
            // Get final data string from course and id
            const finalData = `${this.course.toUpperCase()}/Certificates/${atob(renderData)}`; // /CMS/Certificates/CMS-Dao-Thanh-Long.pdf
            // Add the data parameter to the URL if it is not already present
            const checkData = renderData.slice(-20, -5);
            if (this.urlParams.get('data') != checkData) {
                this.urlParams.set("data", checkData)
                window.location.search = this.urlParams;
            }
            // Get the path to the certificate image
            const currentPath = window.location.origin + window.location.pathname; // http://<url>/verify.html
            const folderPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1); // http://<url>/
            const fullPath = folderPath.endsWith('/') ? folderPath + finalData : folderPath + '/' + finalData;
            // Fetch PDF và tạo một Blob object
            // Render using google docs (work online only)
            const response = await fetch(previewer+fullPath);
            // Render raw data (work on local)
            // const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            // Tạo một URL đến Blob
            this.certURL = URL.createObjectURL(blob);
            // Display the appropriate certificate image
            const source = this.certURL + '#toolbar=0';
            this.resource.src = source;
            return this.certURL;
        } else {
            // Display an error message if there is an error loading the data source file
            this.error.style.display = 'block';
            this.resource.style.display = 'none';
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
