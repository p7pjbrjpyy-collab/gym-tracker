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

    gymData.workoutTemplate.forEach((exercise) => {
        html += createExerciseCard(exercise);
    });

    html += `
            <button id="backHome">
                ← Home
            </button>
        </main>
    `;

    container.innerHTML = html;

    document
        .querySelectorAll(".manage-card")
        .forEach((card) => {
            card.addEventListener("click", () => {
                const id = Number(card.dataset.id);

                const exercise = gymData.workoutTemplate.find(
                    (e) => e.id === id
                );

                showModal(
                    "✏️ Edit Exercise",
                    `
                        <p><strong>${exercise.name}</strong></p>

                        <p>
                            This is our first reusable modal.
                        </p>

                        <p>
                            Soon you'll be able to edit this exercise here.
                        </p>
                    `
                );
            });
        });

    document
        .getElementById("backHome")
        .addEventListener("click", () => {
            location.reload();
        });
}