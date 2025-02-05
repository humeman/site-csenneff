const TECKTIP_URL = "https://tecktip.today:8325/nice"

/**
 * Gets a teck tip and writes it to the element's text content.
 * 
 * @param {Element} element 
 */
function getTip(element) {
    fetch(TECKTIP_URL)
        .then((res) => res.text())
        .then((text) => {
            element.textContent = text;
        })
        .catch((e) => {console.error(e)});
}

/**
 * An event listener which will detect elements of class "tecktip" and
 * calls {@link getTip} on them.
 */
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.getElementsByClassName("tecktip");

    for (let element of elements) {
        getTip(element);
    }
}, false)