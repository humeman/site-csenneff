/**
 * Loads text (presumably ASCII images, but could be anything) from a file and
 * renders it as the content of an element.
 * 
 * Requires data attributes:
 *  - file-src: The file to read.
 * 
 * @param {Element} element 
 */
function readText(element) {
    fetch(element.dataset.textSrc)
        .then((res) => res.text())
        .then((text) => {
            element.textContent = text;
        })
        .catch((e) => {console.error(e)});
}

/**
 * An event listener which will detect elements of class "load-text" and
 * calls {@link readText} on them.
 */
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.getElementsByClassName("load-text");

    for (let element of elements) {
        readText(element);
    }
}, false)