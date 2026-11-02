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
    const row = card.closest(".history-swipe-row");

    if (row.dataset.ignoreClick === "true") {
      row.dataset.ignoreClick = "false";
      return;
    }

    if (row.classList.contains("swiped")) {
      row.classList.remove("swiped");
      return;
    }

    showWorkoutHistoryDetail(Number(card.dataset.workoutId));
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showWorkoutHistoryDetail(Number(card.dataset.workoutId));
    }
  });
});

document.querySelectorAll(".history-swipe-delete").forEach((button) => {
  button.addEventListener("click", () => {
    showDeleteHistoryWorkoutModal(Number(button.dataset.workoutId));
  });
});

attachHistorySwipeHandlers();

    document.getElementById("exportBackup").addEventListener("click", () => {
    exportGymTrackerBackup();
  });

  document.getElementById("historyHome").addEventListener("click", () => {
    location.reload();
  });
}

function createHistoryCard(workout) {
  return `
    <div class="history-swipe-row">
      <button
        class="history-swipe-delete"
        type="button"
        data-workout-id="${workout.id}"
        aria-label="Delete workout from ${formatWorkoutDate(workout.date)}"
      >
        🗑️ Delete
      </button>

      <div
        class="exercise-card manage-card history-card"
        data-workout-id="${workout.id}"
        tabindex="0"
        role="button"
      >
        <div class="exercise-title">
          <h2>${formatWorkoutDate(workout.date)}</h2>

          <span class="chevron">›</span>
        </div>

        <div class="exercise-summary">
          <span>${workout.exercises.length} exercises</span>
          <span>Completed</span>
        </div>
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

  workout.exercises.forEach((exercise, exerciseIndex) => {
  html += `
    <div class="exercise-card">
      <h2>${exercise.name}</h2>

      ${createReadOnlySetRows(exercise)}

      <p><strong>Rest:</strong> ${exercise.rest}</p>

      <div class="exercise-notes">
        <strong>Notes:</strong>
        <p
          class="history-note-text"
          data-exercise-index="${exerciseIndex}"
        ></p>
      </div>
    </div>
  `;
});

    html += `
      <button class="button-primary" id="editHistoryWorkout">
        ✏️ Edit Workout
      </button>
<button
  class="button-danger"
  id="deleteHistoryWorkout"
  type="button"
>
  🗑️ Delete Workout
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

  container.querySelectorAll(".history-note-text").forEach((element) => {
  const exerciseIndex = Number(element.dataset.exerciseIndex);
  const exercise = workout.exercises[exerciseIndex];

  element.textContent = exercise.notes || "No notes recorded";
});

      document
    .getElementById("editHistoryWorkout")
    .addEventListener("click", () => {
      showHistoryWorkoutEditor(workoutId);
    });

    document
  .getElementById("deleteHistoryWorkout")
  .addEventListener("click", () => {
    showDeleteHistoryWorkoutModal(workoutId);
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

function renderHistoryWorkoutDraft(workoutId, draftWorkout) {
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
      <div class="exercise-title">
        <h2>${exercise.name}</h2>

<button
  class="small-button history-move-up"
  data-exercise-index="${exerciseIndex}"
  type="button"
  ${exerciseIndex === 0 ? "disabled" : ""}
>
  ↑
</button>

<button
  class="small-button history-move-down"
  data-exercise-index="${exerciseIndex}"
  type="button"
  ${exerciseIndex === draftWorkout.exercises.length - 1 ? "disabled" : ""}
>
  ↓
</button>

        <button
          class="small-button history-remove-exercise"
          data-exercise-index="${exerciseIndex}"
          type="button"
        >
          Remove
        </button>
      </div>

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

        <div class="set-actions">
          <button
            class="small-button history-add-set"
            data-exercise-index="${exerciseIndex}"
          >
            ➕ Add Set
          </button>

          <button
            class="small-button history-remove-set"
            data-exercise-index="${exerciseIndex}"
            ${exercise.sets.length <= 1 ? "disabled" : ""}
          >
            ➖ Remove Last Set
          </button>
        </div>

        <p>
          <strong>Rest:</strong>
          <input
            class="inline-edit history-rest"
            type="text"
            data-exercise-index="${exerciseIndex}"
            value="${exercise.rest ?? ""}"
          >
        </p>
      </div>
    `;
  });

 html += `
      <button
        class="button-primary"
        id="addHistoryExercise"
        type="button"
      >
        ➕ Add Exercise
      </button>

      <button class="button-success" id="saveHistoryChanges">
        Save Changes
      </button>

      <button class="button-secondary" id="cancelHistoryChanges">
        Cancel
      </button>
    </main>
  `;

  container.innerHTML = html;

  // Synchronise all visible fields with the draft before redrawing.
  function syncDraftInputs() {
    let valid = true;

    container.querySelectorAll(".history-weight").forEach((input) => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);
      const setIndex = Number(input.dataset.setIndex);
      const value = Number(input.value);

      if (!input.value.trim() || !Number.isFinite(value) || value < 0) {
        input.setCustomValidity("Enter a valid weight.");
        valid = false;
        return;
      }

      input.setCustomValidity("");

      const set = draftWorkout.exercises[exerciseIndex].sets[setIndex];

      set.weight = {
        value,
        unit: set.weight?.unit || "kg",
      };
    });

    container.querySelectorAll(".history-reps").forEach((input) => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);
      const setIndex = Number(input.dataset.setIndex);
      const value = Number(input.value);

      if (
        !input.value.trim() ||
        !Number.isInteger(value) ||
        value < 0
      ) {
        input.setCustomValidity("Enter a valid number of reps.");
        valid = false;
        return;
      }

      input.setCustomValidity("");

      draftWorkout.exercises[exerciseIndex].sets[setIndex].reps = value;
    });

    container.querySelectorAll(".history-rest").forEach((input) => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);
      draftWorkout.exercises[exerciseIndex].rest = input.value;
    });

    if (!valid) {
      const invalidInput = container.querySelector(":invalid");

      if (invalidInput) {
        invalidInput.reportValidity();
        invalidInput.focus();
      }
    }

    return valid;
  }

document.querySelectorAll(".history-move-up, .history-move-down")
  .forEach((button) => {
    button.addEventListener("click", () => {
      if (!syncDraftInputs()) return;

      const index = Number(button.dataset.exerciseIndex);

      const direction = button.classList.contains("history-move-up")
        ? -1
        : 1;

      const newIndex = index + direction;

      if (
        newIndex < 0 ||
        newIndex >= draftWorkout.exercises.length
      ) {
        return;
      }

      const exercises = draftWorkout.exercises;

      [exercises[index], exercises[newIndex]] = [
        exercises[newIndex],
        exercises[index],
      ];

      renderHistoryWorkoutDraft(workoutId, draftWorkout);
    });
  });

document.querySelectorAll(".history-remove-exercise").forEach((button) => {
  button.addEventListener("click", () => {
    if (!syncDraftInputs()) return;

    const exerciseIndex = Number(button.dataset.exerciseIndex);
    const exercise = draftWorkout.exercises[exerciseIndex];

    const confirmed = confirm(
      `Remove "${exercise.name}" from this workout?`
    );

    if (!confirmed) return;

    draftWorkout.exercises.splice(exerciseIndex, 1);

    renderHistoryWorkoutDraft(workoutId, draftWorkout);
  });
});

document.getElementById("addHistoryExercise")
  .addEventListener("click", () => {
    if (!syncDraftInputs()) return;

    const overlay = showModal(
      "➕ Add Exercise",
      `
        <label class="form-label">
          Exercise Name
          <input
            id="historyExerciseName"
            class="inline-edit"
            type="text"
            placeholder="e.g. Face Pull"
          >
        </label>

        <p id="historyExerciseError" class="form-error" hidden></p>

        <button
          class="button-success"
          id="confirmAddHistoryExercise"
          type="button"
        >
          Add Exercise
        </button>
      `,
      "Cancel"
    );

    const nameInput =
      document.getElementById("historyExerciseName");

    const errorMessage =
      document.getElementById("historyExerciseError");

    const addButton =
      document.getElementById("confirmAddHistoryExercise");

    nameInput.focus();

    function addExercise() {
      const name = nameInput.value.trim().replace(/\s+/g, " ");

      if (!name) {
        errorMessage.textContent = "Please enter an exercise name.";
        errorMessage.hidden = false;
        nameInput.focus();
        return;
      }

      const duplicate = draftWorkout.exercises.some(
        (exercise) =>
          exercise.name.trim().toLowerCase() === name.toLowerCase()
      );

      if (duplicate) {
        errorMessage.textContent =
          "This exercise is already in the workout.";
        errorMessage.hidden = false;
        return;
      }

      const exercise = createExercise(name);

      // Keep the exercise ID unique within this workout.
      const existingIds = new Set(
        draftWorkout.exercises.map((item) => item.id)
      );

      while (existingIds.has(exercise.id)) {
        exercise.id = Math.max(
          0,
          ...draftWorkout.exercises.map((item) => Number(item.id) || 0)
        ) + 1;
      }

      draftWorkout.exercises.push(exercise);

      overlay.remove();

      renderHistoryWorkoutDraft(workoutId, draftWorkout);
    }

    addButton.addEventListener("click", addExercise);

    nameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addExercise();
      }
    });
  });

  document.querySelectorAll(".history-add-set").forEach((button) => {
    button.addEventListener("click", () => {
      if (!syncDraftInputs()) return;

      const exerciseIndex = Number(button.dataset.exerciseIndex);
      const exercise = draftWorkout.exercises[exerciseIndex];

      const lastSet = exercise.sets[exercise.sets.length - 1];

      exercise.sets.push({
        setNumber: lastSet.setNumber + 1,
        weight: lastSet.weight
          ? { ...lastSet.weight }
          : null,
        reps: lastSet.reps,
      });

      renderHistoryWorkoutDraft(workoutId, draftWorkout);
    });
  });

  document.querySelectorAll(".history-remove-set").forEach((button) => {
    button.addEventListener("click", () => {
      if (!syncDraftInputs()) return;

      const exerciseIndex = Number(button.dataset.exerciseIndex);
      const exercise = draftWorkout.exercises[exerciseIndex];

      if (exercise.sets.length <= 1) return;

      exercise.sets.pop();

      renderHistoryWorkoutDraft(workoutId, draftWorkout);
    });
  });

  document
    .getElementById("saveHistoryChanges")
    .addEventListener("click", () => {
      if (!syncDraftInputs()) return;

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

      latestData.history[historyIndex] = draftWorkout;

      saveData(latestData);
      showWorkoutHistoryDetail(workoutId);
    });

  document
  .getElementById("cancelHistoryChanges")
  .addEventListener("click", () => {
    // Capture any edits still visible in the input fields.
    // Invalid inputs are still treated as unsaved changes.
    container.querySelectorAll(".history-weight").forEach((input) => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);
      const setIndex = Number(input.dataset.setIndex);
      const set = draftWorkout.exercises[exerciseIndex].sets[setIndex];

      const value = input.value.trim();

      set.weight = {
        value: value === "" ? "" : Number(value),
        unit: set.weight?.unit || "kg",
      };
    });

    container.querySelectorAll(".history-reps").forEach((input) => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);
      const setIndex = Number(input.dataset.setIndex);

      const value = input.value.trim();

      draftWorkout.exercises[exerciseIndex].sets[setIndex].reps =
        value === "" ? "" : Number(value);
    });

    container.querySelectorAll(".history-rest").forEach((input) => {
      const exerciseIndex = Number(input.dataset.exerciseIndex);

      draftWorkout.exercises[exerciseIndex].rest = input.value;
    });

    const savedWorkout = loadData().history.find(
      (workout) => workout.id === workoutId
    );

    if (!savedWorkout) {
      showHistory();
      return;
    }

    const hasChanges =
      JSON.stringify(draftWorkout) !== JSON.stringify(savedWorkout);

    if (!hasChanges) {
      showWorkoutHistoryDetail(workoutId);
      return;
    }

    const overlay = showModal(
      "Discard Changes?",
      `
        <p>
          You have unsaved changes to this workout.
        </p>

        <p>
          Discarding will lose those changes.
        </p>

        <button
          class="button-danger"
          id="confirmDiscardHistoryChanges"
          type="button"
        >
          Discard Changes
        </button>
      `,
      "Keep Editing"
    );

    document
      .getElementById("confirmDiscardHistoryChanges")
      .addEventListener("click", () => {
        overlay.remove();
        showWorkoutHistoryDetail(workoutId);
      });
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

  // Create a separate copy so Cancel never changes saved history.
  const draftWorkout = structuredClone(originalWorkout);

  renderHistoryWorkoutDraft(workoutId, draftWorkout);
}

function showDeleteHistoryWorkoutModal(workoutId) {
  const gymData = loadData();

  const workout = gymData.history.find(
    (item) => item.id === workoutId
  );

  if (!workout) {
    showHistory();
    return;
  }

  const overlay = showModal(
    "🗑️ Delete Workout?",
    `
      <p>
        Delete the workout from
        <strong>${formatWorkoutDate(workout.date)}</strong>?
      </p>

      <p>
        This will permanently remove the workout and
        all its exercises, sets and notes.
      </p>

      <button
        class="button-danger"
        id="confirmDeleteHistoryWorkout"
        type="button"
      >
        Delete Workout
      </button>
    `,
    "Keep Workout"
  );

  document
    .getElementById("confirmDeleteHistoryWorkout")
    .addEventListener("click", () => {
      const latestData = loadData();

      const workoutIndex = latestData.history.findIndex(
        (item) => item.id === workoutId
      );

      if (workoutIndex === -1) {
        overlay.remove();
        showHistory();
        return;
      }

      latestData.history.splice(workoutIndex, 1);

      saveData(latestData);

      overlay.remove();

      showHistory();
    });
}

function attachHistorySwipeHandlers() {
  const rows = document.querySelectorAll(".history-swipe-row");

  rows.forEach((row) => {
    const card = row.querySelector(".history-card");

    let startX = 0;
    let startY = 0;
    let swiping = false;

    card.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];

        startX = touch.clientX;
        startY = touch.clientY;
        swiping = false;
      },
      { passive: true }
    );

    card.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches[0];

        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) > 20 &&
            Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
          swiping = true;
        }
      },
      { passive: true }
    );

    card.addEventListener("touchend", (event) => {
      if (!swiping) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;

      if (deltaX < -50) {
        document.querySelectorAll(".history-swipe-row.swiped")
          .forEach((openRow) => {
            if (openRow !== row) {
              openRow.classList.remove("swiped");
            }
          });

        row.classList.add("swiped");
      } else if (deltaX > 50) {
        row.classList.remove("swiped");
      }

      row.dataset.ignoreClick = "true";

      // Clear the flag after the gesture-generated click has had
      // an opportunity to fire.
      setTimeout(() => {
        row.dataset.ignoreClick = "false";
      }, 350);
    });
  });
}

/* Workout History — swipe to delete */

.history-swipe-row {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 12px;
}

.history-swipe-row .history-card {
  position: relative;
  z-index: 1;
  margin-bottom: 0;
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.2s ease;
  touch-action: pan-y;
}

.history-swipe-row.swiped .history-card {
  transform: translateX(-100px);
}

.history-swipe-delete {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100px;
  border: none;
  border-radius: 0;
  background: #c93434;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.history-swipe-delete:focus-visible,
.history-card:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: -3px;
}