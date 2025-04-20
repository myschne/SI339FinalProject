document.addEventListener("DOMContentLoaded", function () {
    // 🌙 Theme toggle
    const themeToggleButton = document.getElementById("theme-toggle");
    themeToggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggleButton.textContent = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
    });

    // 📅 Calendar columns
    const calendarColumns = {
        Monday: document.getElementById("monday-column"),
        Tuesday: document.getElementById("tuesday-column"),
        Wednesday: document.getElementById("wednesday-column"),
        Thursday: document.getElementById("thursday-column"),
        Friday: document.getElementById("friday-column"),
    };

    const backpackList = document.getElementById("backpack-list");
    const scheduleList = document.getElementById("schedule-list");

    function compareTimes(t1, t2) {
        const [h1, m1] = t1.split(":").map(Number);
        const [h2, m2] = t2.split(":").map(Number);
        return h1 !== h2 ? h1 - h2 : m1 - m2;
    }

    function handleAddToSchedule(button) {
        button.addEventListener("click", (event) => {
            const classItem = event.target.closest("li");
            const newClassItem = classItem.cloneNode(true);
            const scheduleButton = newClassItem.querySelector(".add-to-schedule");
            if (scheduleButton) scheduleButton.remove();
            scheduleList.appendChild(newClassItem);

            event.target.disabled = true;
            event.target.textContent = "Added";

            const classNameElement = classItem.querySelector("strong");
            if (!classNameElement) return;

            const [className, daysString] = classNameElement.textContent.trim().split(" - ");
            const timeText = classItem.childNodes[2].textContent.trim();
            const [startTime, endTime] = timeText.replace(",", "").split(" - ").map(t => t.trim());
            const days = daysString.split(" & ").map(day => day.trim());

            days.forEach((day) => {
                if (!calendarColumns[day] || !className || !startTime || !endTime) return;

                const classBlock = document.createElement("div");
                classBlock.classList.add("class-block");
                classBlock.dataset.startTime = startTime;
                classBlock.innerHTML = `${className}<br>${startTime} - ${endTime}`;

                const column = calendarColumns[day];
                const existingBlocks = Array.from(column.querySelectorAll(".class-block"));
                let inserted = false;

                for (let i = 0; i < existingBlocks.length; i++) {
                    const existingStartTime = existingBlocks[i].dataset.startTime;
                    if (compareTimes(startTime, existingStartTime) < 0) {
                        column.insertBefore(classBlock, existingBlocks[i]);
                        inserted = true;
                        break;
                    }
                }

                if (!inserted) {
                    column.appendChild(classBlock);
                }
            });
        });
    }

    document.querySelectorAll(".add-to-schedule").forEach(handleAddToSchedule);

    // 🎯 Modal logic
    const addClassButton = document.getElementById("add-class");
    const addClassModal = document.getElementById("add-class-modal");
    const closeModalButton = document.getElementById("close-modal");
    const addClassForm = document.getElementById("add-class-form");

    addClassButton.addEventListener("click", () => {
        addClassModal.style.display = "block";
    });

    closeModalButton.addEventListener("click", () => {
        addClassModal.style.display = "none";
    });

    addClassForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const className = document.getElementById("class-name").value.trim();
        const selectedDaysArray = Array.from(document.querySelectorAll('input[name="days"]:checked'));
        const startTime = document.getElementById("start-time").value;
        const endTime = document.getElementById("end-time").value;
        const errorMessageElement = document.getElementById("form-error");

        errorMessageElement.style.display = "none";
        errorMessageElement.textContent = "";

        if (!className || className.split(" ").length < 2) {
            errorMessageElement.textContent = "Please enter a class name with at least a space (e.g., 'BIO 101').";
            errorMessageElement.style.display = "block";
            return;
        }

        if (selectedDaysArray.length === 0) {
            errorMessageElement.textContent = "Please select at least one day.";
            errorMessageElement.style.display = "block";
            return;
        }

        if (!startTime || !endTime) {
            errorMessageElement.textContent = "Please select both a start and end time.";
            errorMessageElement.style.display = "block";
            return;
        }

        if (startTime >= endTime) {
            errorMessageElement.textContent = "Start time must be before end time.";
            errorMessageElement.style.display = "block";
            return;
        }

        const selectedDays = selectedDaysArray.map(checkbox => checkbox.value).join(" & ");
        const newClassItem = document.createElement("li");
        newClassItem.innerHTML = `
            <strong>${className} - ${selectedDays}</strong>, ${startTime} - ${endTime}
            <button class="add-to-schedule">Add to Schedule</button>
        `;

        const button = newClassItem.querySelector(".add-to-schedule");
        handleAddToSchedule(button);

        backpackList.appendChild(newClassItem);
        addClassModal.style.display = "none";
        addClassForm.reset();
    });

    // 🗓️ Update footer year
    document.getElementById("currentYear").textContent = new Date().getFullYear();
});
