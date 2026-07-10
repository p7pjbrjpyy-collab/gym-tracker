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

function showModal(title, content, closeLabel = "Close") {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal">
      <h2>${title}</h2>

      ${content}

      <button class="button-secondary" id="closeModal">
        ${closeLabel}
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("closeModal").addEventListener("click", () => {
    overlay.remove();
  });

  return overlay;
}