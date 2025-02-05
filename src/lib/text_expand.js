const EXPAND_DELAY = 3000;
const CHAR_DELAY = 150;

/**
 * Animates a text cursor writing out text to the content of an element.
 * 
 * Requires data attributes:
 *  - expand-to: The text which will be written out when complete
 * 
 * @param {Element} element 
 */
function expandText(element) {
    element.dataset.currentProgress += element.dataset.expandTo.charAt(element.dataset.currentProgress.length);
    element.textContent = element.dataset.currentProgress + "█";

    if (element.dataset.currentProgress.length != element.dataset.expandTo.length) {
        window.setTimeout(
            () => {
                expandText(element)
            },
            CHAR_DELAY
        );
    }
    else {
        element.textContent = element.dataset.currentProgress;
    }
}

/**
 * An event listener which will detect elements of class "text-expand" and
 * schedule {@link expandText} calls after {@link EXPAND_DELAY}.
 */
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.getElementsByClassName("text-expand");

    for (let element of elements) {
        window.setTimeout(
            () => {
                element.dataset.currentProgress = "";
                expandText(element);
            },
            EXPAND_DELAY
        )
    }
}, false)