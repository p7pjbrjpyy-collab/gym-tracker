// =================================
// Gym Tracker
// App Controller
// =================================

document.addEventListener("DOMContentLoaded", () => {
    const startWorkoutButton = document.getElementById("startWorkout");
    const manageWorkoutButton = document.getElementById("manageWorkout");

    startWorkoutButton.addEventListener("click", () => {
        showWorkout();
    });

    manageWorkoutButton.addEventListener("click", () => {
        showManageWorkout();
    });
});

function showWorkout() {
    const gymData = loadData();

    gymData.activeWorkout = createActiveWorkoutFromTemplate(
        gymData.workoutTemplate
    );

    saveData(gymData);

    renderWorkout();
}

function renderWorkout() {
    const gymData = loadData();
    const activeWorkout = gymData.activeWorkout;
    const container = document.querySelector(".container");

    let workoutHTML = `
        <header>
            <h1>💪 Today's Workout</h1>
            <p class="subtitle">
                ${activeWorkout.date}
            </p>
        </header>

        <main>
    `;

    activeWorkout.exercises.forEach((exercise) => {
        workoutHTML += `
            <div class="exercise-card">
                <h2>${exercise.name}</h2>

                ${createSetRows(exercise)}

                <p>
                    <strong>Rest:</strong>
                    ${exercise.rest}
                </p>
            </div>
        `;
    });

    workoutHTML += `
        </main>

        <button id="backHome">
            ← Back Home
        </button>
    `;

    container.innerHTML = workoutHTML;

    document.getElementById("backHome").addEventListener("click", () => {
        location.reload();
    });

    attachWeightValueEditHandlers();
    attachWeightUnitEditHandlers();
}

function createSetRows(exercise) {
    if (exercise.sets.length === 0) {
        return `
            <p>
                Not tracked
            </p>
        `;
    }

    let setsHTML = `<div class="set-list">`;

    exercise.sets.forEach((set) => {
        const weightValue = set.weight ? set.weight.value : "-";
        const weightUnit = set.weight ? set.weight.unit : "";

        setsHTML += `
            <div class="set-row">
                <span>Set ${set.setNumber}</span>

                <span>
                    <span
                        class="editable-weight-value"
                        data-exercise-id="${exercise.id}"
                        data-set-number="${set.setNumber}"
                    >
                        ${weightValue}
                    </span>

                    <span
                        class="editable-weight-unit"
                        data-exercise-id="${exercise.id}"
                        data-set-number="${set.setNumber}"
                    >
                        ${weightUnit}
                    </span>
                </span>

                <span>${set.reps} reps</span>
            </div>
        `;
    });

    setsHTML += `</div>`;

    return setsHTML;
}

function attachWeightValueEditHandlers() {
    document.querySelectorAll(".editable-weight-value").forEach((element) => {
        element.addEventListener("click", () => {
            const currentValue = element.innerText.trim();

            element.innerHTML = `
                <input
                    class="inline-edit"
                    type="text"
                    value="${currentValue}"
                >
            `;

            const input = element.querySelector("input");

            input.focus();
            input.select();

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    saveEditedWeightValue(element, input.value);
                }
            });

            input.addEventListener("blur", () => {
                saveEditedWeightValue(element, input.value);
            });
        });
    });
}

function attachWeightUnitEditHandlers() {
    document.querySelectorAll(".editable-weight-unit").forEach((element) => {
        element.addEventListener("click", () => {
            const currentValue = element.innerText.trim();

            element.innerHTML = `
                <input
                    class="inline-edit unit-edit"
                    type="text"
                    value="${currentValue}"
                >
            `;

            const input = element.querySelector("input");

            input.focus();
            input.select();

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    saveEditedWeightUnit(element, input.value);
                }
            });

            input.addEventListener("blur", () => {
                saveEditedWeightUnit(element, input.value);
            });
        });
    });
}

function saveEditedWeightValue(element, newValue) {
    const gymData = loadData();
    const set = findSetFromElement(gymData, element);

    set.weight = {
        value: Number(newValue),
        unit: set.weight ? set.weight.unit : "kg"
    };

    saveData(gymData);
    renderWorkout();
}

function saveEditedWeightUnit(element, newUnit) {
    const gymData = loadData();
    const set = findSetFromElement(gymData, element);

    set.weight = {
        value: set.weight ? set.weight.value : 0,
        unit: newUnit
    };

    saveData(gymData);
    renderWorkout();
}

function findSetFromElement(gymData, element) {
    const exerciseId = Number(element.dataset.exerciseId);
    const setNumber = Number(element.dataset.setNumber);

    const exercise = gymData.activeWorkout.exercises.find(
        (item) => item.id === exerciseId
    );

    return exercise.sets.find((item) => item.setNumber === setNumber);
}