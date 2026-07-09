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
                <span>${set.weight}</span>
                <span>${set.reps} reps</span>
            </div>
        `;
    });

    setsHTML += `</div>`;

    return setsHTML;
}