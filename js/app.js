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

                <p>
                    <strong>Sets:</strong>
                    ${exercise.sets.length}
                </p>

                <p>
                    <strong>First set:</strong>
                    ${
                        exercise.sets[0]
                            ? `${exercise.sets[0].weight} × ${exercise.sets[0].reps}`
                            : "Not tracked"
                    }
                </p>

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