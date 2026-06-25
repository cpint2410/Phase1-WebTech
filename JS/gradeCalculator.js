function getUniGrade(mark) {

    if (mark >= 70) return "1st Class Honours";
    if (mark >= 60) return "2:1";
    if (mark >= 50) return "2:2";
    if (mark >= 40) return "3rd Class";
    return "Fail";

}

function getBarColor(mark) {

    if (mark >= 70) return "#28a745";
    if (mark >= 60) return "#17a2b8";
    if (mark >= 50) return "#ffc107";
    if (mark >= 40) return "#fd7e14";
    return "#dc3545";

}

function createProgressBar(percent) {

    const color = getBarColor(percent);

    return `
        <div class="progress" style="height: 10px; margin-top: 6px;">
            <div class="progress-bar bar-anim"
                style="width: 0%; background-color: ${color};"
                data-width="${percent}">
            </div>
        </div>
    `;

}

function animateBars() {

    setTimeout(() => {

        const bars = document.querySelectorAll(".bar-anim, .year-progress-bar");

        bars.forEach((bar, index) => {

            const target = bar.getAttribute("data-width");

            setTimeout(() => {

                bar.style.transition = "width 1.2s ease-in-out";
                bar.style.width = target + "%";

            }, index * 100);

        });

    }, 500);

}

function renderModules(filterYear) {

    const modules = document.querySelectorAll(".uni-module");

    let total = 0;
    let count = 0;

    modules.forEach(module => {

        const year = module.dataset.year;
        const percentage = parseFloat(module.dataset.mark);

        const isVisible = (filterYear === "all" || year === filterYear);

        module.style.display = isVisible ? "block" : "none";

        if (isVisible && !isNaN(percentage)) {

            const grade = getUniGrade(percentage);

            module.innerHTML = `
                ${module.dataset.code} - ${module.dataset.name}
                (${grade} - ${percentage}%)
                ${createProgressBar(percentage)}
            `;

            total += percentage;
            count++;

        } else if (isVisible && isNaN(percentage)) {

            module.innerHTML = `
                ${module.dataset.code} - ${module.dataset.name} (TBC)
                ${createProgressBar(0)}
            `;

        }

    });

    const average = count ? total / count : 0;
    const overallGrade = getUniGrade(average);
    const color = getBarColor(average);

    const existing = document.querySelector(".overall-box");
    if (existing) existing.remove();

    const overallHTML = `
        <div class="overall-box" style="margin-top: 10px; color: var(--text-secondary);">
            <strong>
                Overall Average: ${average.toFixed(1)}% (${overallGrade})
            </strong>

            <div class="progress" style="height: 14px; margin-top: 6px;">
                <div class="progress-bar bar-anim"
                    style="width: 0%; background-color: ${color};"
                    data-width="${average}">
                </div>
            </div>
        </div>
    `;

    const header = document.querySelector(".education-header div");

    if (header && !document.querySelector(".overall-box")) {
        header.insertAdjacentHTML("afterend", overallHTML);
    }

    document.querySelectorAll(".year-section").forEach(section => {

        const year = section.getAttribute("data-year");

        if (filterYear === "all" || filterYear === year) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }

    });

    // Update Year Completion Progress Bars
document.querySelectorAll(".year-section").forEach(section => {

    const modulesInYear = section.querySelectorAll(".uni-module");

    const totalModules = modulesInYear.length;

    const completedModules = [...modulesInYear].filter(module => {
        return module.dataset.mark !== "";
    }).length;

    const progress = totalModules
        ? Math.round((completedModules / totalModules) * 100)
        : 0;

    const progressBar = section.querySelector(".year-progress-bar");
    const progressText = section.querySelector(".year-progress-text");

    if (!progressBar || !progressText) return;

    progressText.textContent = `${progress}% Complete`;

    progressBar.setAttribute("data-width", progress);
    progressBar.style.width = "0%";

    let color;

    if (progress < 25) {
        color = "#dc3545"; // red
    } else if (progress < 50) {
        color = "#ffc107"; // yellow
    } else if (progress < 75) {
        color = "#17a2b8"; // blue
    } else {
        color = "#28a745"; // green
    }

    progressBar.style.backgroundColor = color;
    progressBar.textContent = `${progress}%`;

});

    animateBars();

}

document.addEventListener("DOMContentLoaded", () => {

    renderModules("all");

    const dropdown = document.getElementById("yearFilter");

    if (dropdown) {
        dropdown.addEventListener("change", (e) => {
            renderModules(e.target.value);
        });
    }

});

document.getElementById('year').textContent = new Date().getFullYear();
