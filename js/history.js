// =================================
// Workout History
// =================================

function showHistory() {
  const gymData = loadData();
  const container = document.querySelector(".container");

  const workouts = [...gymData.history].reverse();

  let html = `
    <header>
      <h1>📜 Workout History</h1>

      <p class="subtitle">
        Review your completed workouts
      </p>
    </header>

    <main>
  `;

  if (workouts.length === 0) {
    html += `
      <section class="last-workout">
        <h2>No completed workouts yet</h2>

        <p>
          Complete a workout and it will appear here.
        </p>
      </section>
    `;
  } else {
    workouts.forEach((workout) => {
      html += createHistoryCard(workout);
    });
  }

    html += `
      <button class="button-secondary" id="exportBackup">
        📥 Export Backup
      </button>

      <button class="button-secondary" id="historyHome">
        🏠 Return Home
      </button>
    </main>
  `;

  container.innerHTML = html;

  document.querySelectorAll(".history-card").forEach((card) => {
    card.addEventListener("click", () => {
      const workoutId = Number(card.dataset.workoutId);

      showWorkoutHistoryDetail(workoutId);
    });
  });

    document.getElementById("exportBackup").addEventListener("click", () => {
    exportGymTrackerBackup();
  });

  document.getElementById("historyHome").addEventListener("click", () => {
    location.reload();
  });
}

function createHistoryCard(workout) {
  return `
    <div
      class="exercise-card manage-card history-card"
      data-workout-id="${workout.id}"
    >
      <div class="exercise-title">
        <h2>${formatWorkoutDate(workout.date)}</h2>

        <span class="chevron">
          ›
        </span>
      </div>

      <div class="exercise-summary">
        <span>
          ${workout.exercises.length} exercises
        </span>

        <span>
          Completed
        </span>
      </div>
    </div>
  `;
}

function showWorkoutHistoryDetail(workoutId) {
  const gymData = loadData();

  const workout = gymData.history.find((item) => item.id === workoutId);

  if (!workout) {
    showHistory();
    return;
  }

  const container = document.querySelector(".container");

  let html = `
    <header>
      <h1>💪 Completed Workout</h1>

      <p class="subtitle">
        ${formatWorkoutDate(workout.date)}
      </p>
    </header>

    <main>
  `;

  workout.exercises.forEach((exercise) => {
    html += `
      <div class="exercise-card">
        <h2>${exercise.name}</h2>

        ${createReadOnlySetRows(exercise)}

        <p>
          <strong>Rest:</strong>
          ${exercise.rest}
        </p>
      </div>
    `;
  });

    html += `
      <button class="button-primary" id="editHistoryWorkout">
        ✏️ Edit Workout
      </button>

      <button class="button-secondary" id="backToHistory">
        ← Workout History
      </button>

      <button class="button-secondary" id="historyDetailHome">
        🏠 Return Home
      </button>
    </main>
  `;

  container.innerHTML = html;

      document
    .getElementById("editHistoryWorkout")
    .addEventListener("click", () => {
      showHistoryWorkoutEditor(workoutId);
    });

  document.getElementById("backToHistory").addEventListener("click", () => {
    showHistory();
  });

  document
    .getElementById("historyDetailHome")
    .addEventListener("click", () => {
      location.reload();
    });
}

function createReadOnlySetRows(exercise) {
  if (exercise.sets.length === 0) {
    return `
      <p>
        Not tracked
      </p>
    `;
  }

  let html = `<div class="set-list">`;

  exercise.sets.forEach((set) => {
    const weight = set.weight
      ? `${set.weight.value} ${set.weight.unit}`.trim()
      : "-";

    html += `
      <div class="set-row">
        <span>Set ${set.setNumber}</span>

        <span>
          ${weight}
        </span>

        <span>
          ${set.reps} reps
        </span>
      </div>
    `;
  });

  html += `</div>`;

  return html;
}

function formatWorkoutDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function showHistoryWorkoutEditor(workoutId) {
  const gymData = loadData();

  const originalWorkout = gymData.history.find(
    (workout) => workout.id === workoutId
  );

  if (!originalWorkout) {
    showHistory();
    return;
  }

  // Work on a copy, not the saved workout.
  const draftWorkout = structuredClone(originalWorkout);

  const container = document.querySelector(".container");

  let html = `
    <header>
      <h1>✏️ Edit Workout</h1>
      <p class="subtitle">
        ${formatWorkoutDate(draftWorkout.date)}
      </p>
    </header>

    <main>
  `;

  draftWorkout.exercises.forEach((exercise, exerciseIndex) => {
    html += `
      <div class="exercise-card">
        <h2>${exercise.name}</h2>
        <div class="set-list">
    `;

    exercise.sets.forEach((set, setIndex) => {
      html += `
        <div class="set-row">
          <span>Set ${set.setNumber}</span>

          <input
            class="inline-edit history-weight"
            type="number"
            inputmode="decimal"
            min="0"
            step="any"
            data-exercise-index="${exerciseIndex}"
            data-set-index="${setIndex}"
            value="${set.weight?.value ?? 0}"
            aria-label="Set ${set.setNumber} weight"
          >

          <input
            class="inline-edit history-reps"
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            data-exercise-index="${exerciseIndex}"
            data-set-index="${setIndex}"
            value="${set.reps ?? 0}"
            aria-label="Set ${set.setNumber} reps"
          >
        </div>
      `;
    });

       html += `
        </div>

        <p>
          <strong>Rest:</strong>
          <input
            class="inline-edit history-rest"
            type="text"
            data-exercise-index="${exerciseIndex}"
            value="${exercise.rest ?? ""}"
            aria-label="Rest period for ${exercise.name}"
          >
        </p>
      </div>
    `;
  });

  html += `
     <button class="button-success" id="saveHistoryChanges">
  Save Changes
</button>

      <button class="button-secondary" id="cancelHistoryChanges">
        Cancel
      </button>
    </main>
  `;

  container.innerHTML = html;

  document.querySelectorAll(".history-weight").forEach((input) => {
    input.addEventListener("input", () => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);
      const setIndex = Number(input.dataset.setIndex);
      const value = Number(input.value);

      if (!input.value.trim() || !Number.isFinite(value) || value < 0) {
        input.setCustomValidity("Enter a valid weight.");
        return;
      }

      input.setCustomValidity("");

      const set = draftWorkout.exercises[exerciseIndex].sets[setIndex];

      set.weight = {
        value,
        unit: set.weight?.unit || "kg",
      };
    });
  });

  document.querySelectorAll(".history-reps").forEach((input) => {
    input.addEventListener("input", () => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);
      const setIndex = Number(input.dataset.setIndex);
      const value = Number(input.value);

      if (
        !input.value.trim() ||
        !Number.isInteger(value) ||
        value < 0
      ) {
        input.setCustomValidity("Enter a valid number of reps.");
        return;
      }

      input.setCustomValidity("");

      draftWorkout.exercises[exerciseIndex].sets[setIndex].reps = value;
    });
  });

  document.querySelectorAll(".history-rest").forEach((input) => {
    input.addEventListener("input", () => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);

      draftWorkout.exercises[exerciseIndex].rest =
        input.value;
    });
  });

  document
    .getElementById("saveHistoryChanges")
    .addEventListener("click", () => {
      const inputs = container.querySelectorAll(
        ".history-weight, .history-reps"
      );

      // Check every field before saving.
      for (const input of inputs) {
        if (
          !input.value.trim() ||
          !input.checkValidity()
        ) {
          input.reportValidity();
          input.focus();
          return;
        }
      }

      const latestData = loadData();

      const historyIndex = latestData.history.findIndex(
        (workout) => workout.id === workoutId
      );

      if (historyIndex === -1) {
        showModal(
          "Workout Not Found",
          "<p>This workout could not be saved.</p>"
        );
        return;
      }

      // Replace only the selected historical workout.
      latestData.history[historyIndex] = draftWorkout;

      saveData(latestData);

      showWorkoutHistoryDetail(workoutId);
    });

  document
    .getElementById("cancelHistoryChanges")
    .addEventListener("click", () => {
      showWorkoutHistoryDetail(workoutId);
    });
}