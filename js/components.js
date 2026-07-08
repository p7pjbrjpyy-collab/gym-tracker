// =================================
// Gym Tracker Components
// =================================

function createExerciseCard(exercise) {

    return `
        <div
            class="exercise-card manage-card"
            data-id="${exercise.id}"
        >

            <div class="exercise-title">

                <h2>${exercise.name}</h2>

                <span class="chevron">
                    ›
                </span>

            </div>

            <div class="exercise-summary">

                <span>
                    ${exercise.sets} × ${exercise.reps}
                </span>

                <span>
                    ${exercise.weight}
                </span>

            </div>

        </div>
    `;

}