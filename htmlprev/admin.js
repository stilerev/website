(function () {
    const MODAL_TITLE_ID = document.getElementById("img-modal-title");
    const MODAL_NAME_INPUT = document.getElementById("img-modal-name-input");

    class UploadedImage {
        constructor(src, name = "") {
            this.src = src;
            this.name = name || src;

            this.getElement().addEventListener("click", () => {
                MODAL_TITLE_ID.innerHTML = this.name;
                MODAL_NAME_INPUT.value = this.name;
            });
        }

        getElement() {
            return document.querySelector(`[src="${this.src}"]`);
        }
    }

    new UploadedImage("image.jpg")
})();