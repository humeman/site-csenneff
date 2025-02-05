import { loadTextWithin } from "./load_text.js";

let data = {}

/**
 * Loads work items from a JSON file and renders them as the content of an element.
 * 
 * Requires data attributes:
 *  - file-src: The file to read.
 * 
 * Requires a unique ID to be set.
 * 
 * @param {Element} element 
 */
function readWork(element) {
    fetch(element.dataset.fileSrc)
        .then((res) => res.json())
        .then((jsonData) => {
            data[element.id] = jsonData;
            const filter = document.getElementById(element.dataset.filterElement);
            filter.addEventListener("input", () => {
                renderWork(element, filter);
            });
            renderWork(element, filter);
        })
        .catch((e) => {console.error(e)});
}

function renderWork(element, filterElement) {
    let work = data[element.id];
    let needsReload = false;

    element.innerHTML = "";
    for (let [category, projects] of Object.entries(work)) {
        let filteredProjects = filter(projects, filterElement);

        if (filteredProjects.length == 0) continue;

        let projectsHTML = [];
        for (let project of filteredProjects) {
            let projectHTML = `
            <div class="container2 flex-col-2">
                <div class="scanlines pad-m flex-col">
            `

            const logoPath = project["logo"];
            if (logoPath !== undefined) {
                projectHTML += `
                <pre class="logo load-text center-text"
                    data-text-src="${logoPath}">
                </pre>
                `
                needsReload = true;
            }

            projectHTML += `
            <h3 class="center-text">${project["title"]}</h3>
            <p>${project["description"].join("")}</p>
            `

            const location = project["location"];
            if (location !== undefined) {
                projectHTML += `<p><span class="flatten-emoji-primary-1">&#128205;</span> ${location}</p>`
            }

            const date = project["date"];
            if (date !== undefined) {
                if (date instanceof Array && date.length == 2) {
                    projectHTML += `<p><span class="flatten-emoji-primary-1">&#128467;</span> <strong>${date[0]}</strong> to <strong>${date[1]}</strong></p>`
                } else if (typeof date == "string" || date instanceof String) {
                    projectHTML += `<p><span class="flatten-emoji-primary-1">&#128467;</span> <strong>${date}</strong>`
                } else {
                    console.warn(`Skipping date element of ${project["title"]} -- must be String or String[2]`);
                }
            }

            let marginSet = false;
            const links = project["links"];
            if (links !== undefined) {
                if (!(links instanceof Object)) {
                    console.warn(`Skipping links element of ${project["title"]} -- must be Object`);
                }
                else {
                    marginSet = true;
                    projectHTML += `<div class="bottom flex-center flex-row flex-wrap">`
                    for (let [name, url] of Object.entries(links)) {
                        projectHTML += `<a class="margin-xs bg-primary-1 fake-button-mini" href="${url}">${name}</a>`
                    }
                    projectHTML += `</div>`
                }
            }

            const skills = project["skills"];
            if (skills !== undefined) {
                if (!(skills instanceof Object)) {
                    console.warn(`Skipping skills element of ${project["title"]} -- must be Object`);
                }
                else {
                    const primary = skills["primary"]

                    if (primary !== undefined) {
                        projectHTML += `<div class="${marginSet ? "" : "bottom "}flex-center flex-row flex-wrap">`
                        for (let skill of primary) {
                            projectHTML += `<button class="skill margin-xs mini" data-filter-id=\"${filterElement.id}\" data-container-id=\"${element.id}\">${skill}</button>`
                        }
                        projectHTML += `</div>`
                    }
                }
            }

            projectHTML += "</div></div>"
            projectsHTML.push(projectHTML);
        }

        element.innerHTML += `
        <h2 class="center-text">${category}</h2>
        <div class="cols margin-m flex">
            ${projectsHTML.join("")}
        </div>
        `
    }

    if (needsReload) {
        loadTextWithin(`#${element.id}`);
    }

    registerEventListeners(element.id);
}

function filter(projects, filterElement) {
    if (filterElement == null) return projects;

    let filterStr = filterElement.value.replaceAll(" ", "").toLowerCase();
    if (filterStr.length == 0) return projects;
    let res = [];

    for (let project of projects) {
        console.log(project);
        if (objectContains(project, filterStr)) res.push(project);
    }
    return res;
}

function anyContains(element, filterStr) {
    if (typeof element == "string" || element instanceof String) {
        return element.replaceAll(" ", "").toLowerCase().includes(filterStr);
    }
    else if (element instanceof Number) {
        return element.includes(filterStr);
    }
    else if (element instanceof Array) {
        return arrayContains(element, filterStr);
    }
    else if (element instanceof Object) {
        return objectContains(element, filterStr);
    }
    return false;
}

function objectContains(element, filterStr) {
    for (let [key, val] of Object.entries(element)) {
        if (anyContains(val, filterStr)) return true;
    }
    return false;
}

function arrayContains(element, filterStr) {
    for (let val of element) {
        if (anyContains(val, filterStr)) {
            return true;
        }
    }
    return false;
}

function registerEventListeners(parentId) {
    const elements = document.querySelectorAll(`#${parentId} button.skill`);

    for (let element of elements) {
        element.addEventListener("click", filterTo);
    }
}

export function filterTo(event) {
    const targetContainer = document.getElementById(event.target.dataset.containerId);
    const targetFilter = document.getElementById(event.target.dataset.filterId);
    targetFilter.value = event.target.textContent;
    renderWork(targetContainer, targetFilter);
}

/**
 * An event listener which will detect elements of class "load-work" and
 * calls {@link readWork} on them.
 */
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.getElementsByClassName("load-work");

    for (let element of elements) {
        readWork(element);
    }
}, false)

