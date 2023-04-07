class CertData {
    constructor() {
        this.dataUrl = './datasheet.json';
        this.validIds = [];
        this.urlParams = new URLSearchParams(window.location.search);
        this.id = this.urlParams.get('id');
        this.resource = document.getElementById('certImg');
        this.error = document.getElementById('error-message');
    }

    async loadData() {
        // Get the ID parameter from the URL
        const response = await fetch(this.dataUrl);
        const data = await response.json();
        this.validIds = Object.keys(data);
        return data;
    }

    // Load the data source file and render the certificate image
    renderData() {
        // Check if the ID is valid
        if (this.validIds.includes(this.id)) {
            const data = this.data[this.id];
            // Add the data parameter to the URL if it is not already present
            const checkData = data.slice(-20, -5);
            if (this.urlParams.get('data') != checkData) {
                this.urlParams.set("data", checkData)
                window.location.search = this.urlParams;
            }
            // Display the appropriate certificate image
            const source = atob(data) + '#toolbar=0';
            this.resource.src = source;
            return atob(data)
        } else {
            // Display an error message if there is an error loading the data source file
            this.error.style.display = 'block';
            this.resource.style.display = 'none';
            if (this.urlParams.get('data')) {
                this.urlParams.delete('data');
                var newUrl = `${window.location.pathname}?${this.urlParams.toString()}`;
                window.history.replaceState(null, null, newUrl);
            }
            return null;
        }
    }

    async init() {
        this.data = await this.loadData();
        // Load the contents of the data source file into the validIds variable
        this.renderData();
    }
}

// Create an instance of the CertData class and load and render the certificate image
let certData = new CertData();
certData.init();