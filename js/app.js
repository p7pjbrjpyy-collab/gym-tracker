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

    attachWeightEditHandlers();
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
        setsHTML += `
            <div class="set-row">
                <span>Set ${set.setNumber}</span>

                <span
                    class="editable-weight"
                    data-exercise-id="${exercise.id}"
                    data-set-number="${set.setNumber}"
                >
                    ${formatWeight(set.weight)}
                </span>

                <span>${set.reps} reps</span>
            </div>
        `;
    });

    setsHTML += `</div>`;

    return setsHTML;
}

function attachWeightEditHandlers() {
    document.querySelectorAll(".editable-weight").forEach((weightElement) => {
        weightElement.addEventListener("click", () => {
            const gymData = loadData();

            const exerciseId = Number(weightElement.dataset.exerciseId);
            const setNumber = Number(weightElement.dataset.setNumber);

            const exercise = gymData.activeWorkout.exercises.find(
                (item) => item.id === exerciseId
            );

            const set = exercise.sets.find(
                (item) => item.setNumber === setNumber
            );

            const currentValue = set.weight ? set.weight.value : "";

            weightElement.innerHTML = `
                <input
                    class="inline-edit"
                    type="text"
                    value="${currentValue}"
                >
            `;

            const input = weightElement.querySelector("input");

            input.focus();
            input.select();

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    saveEditedWeight(weightElement, input.value);
                }
            });

            input.addEventListener("blur", () => {
                saveEditedWeight(weightElement, input.value);
            });
        });
    });
}

function saveEditedWeight(weightElement, newWeight) {
    const gymData = loadData();

    const exerciseId = Number(weightElement.dataset.exerciseId);
    const setNumber = Number(weightElement.dataset.setNumber);

    const exercise = gymData.activeWorkout.exercises.find(
        (item) => item.id === exerciseId
    );

    const set = exercise.sets.find((item) => item.setNumber === setNumber);

    set.weight = {
        value: Number(newWeight),
        unit: set.weight ? set.weight.unit : "kg"
    };

    saveData(gymData);

    renderWorkout();
}