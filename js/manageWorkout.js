// =================================
// Manage Workout Screen
// =================================

function showManageWorkout() {

    const gymData = loadData();

    const container = document.querySelector(".container");

    let html = `
        <header>
            <h1>✏️ Manage Workout</h1>
            <p class="subtitle">
                Edit your workout template
            </p>
        </header>

        <main>
    `;

    gymData.workoutTemplate.forEach(exercise => {

        html += `
            <div class="exercise-card">
                <h2>${exercise.name}</h2>
            </div>
        `;

    });

    html += `
            <button id="backHome">
                ← Home
            </button>
        </main>
    `;

    container.innerHTML = html;

    document
        .getElementById("backHome")
        .addEventListener("click", () => {

            location.reload();

        });

}