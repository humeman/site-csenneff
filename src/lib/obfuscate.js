const ENCODED = "jhtkluGjzluulmm5jvt"
const SHIFT = 7

function setEmail(element) {
    let decoded = "";

    for (let i = 0; i < ENCODED.length; i++) {
        decoded += String.fromCharCode(ENCODED.charCodeAt(i) - SHIFT)
    }

    element.textContent = decoded;
    element.href = `mailto:${decoded}`;
}


/**
 * An event listener which will detect elements of class "load-email" and
 * calls {@link setEmail} on them.
 */
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.getElementsByClassName("load-email");

    for (let element of elements) {
        setEmail(element);
    }
}, false)
