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
      <button class="button-secondary" id="backToHistory">
        ← Workout History
      </button>

      <button class="button-secondary" id="historyDetailHome">
        🏠 Return Home
      </button>
    </main>
  `;

  container.innerHTML = html;

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