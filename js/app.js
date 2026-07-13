// =================================
// Gym Tracker
// App Controller
// =================================

document.addEventListener("DOMContentLoaded", () => {
  const startWorkoutButton = document.getElementById("startWorkout");
  const manageWorkoutButton = document.getElementById("manageWorkout");
  const historyButton = document.getElementById("history");

startWorkoutButton.addEventListener("click", () => {
  const gymData = loadData();

  if (gymData.activeWorkout) {
    renderWorkout();
    return;
  }

  showNewWorkoutModal();
});

  manageWorkoutButton.addEventListener("click", () => {
    showManageWorkout();
  });

  historyButton.addEventListener("click", () => {
    showHistory();
  });

  updateHomeScreen();

});

function updateHomeScreen() {
  const gymData = loadData();

  const startWorkoutButton = document.getElementById("startWorkout");
  const lastWorkoutSection = document.querySelector(".last-workout");

  if (gymData.activeWorkout) {
    const exerciseCount = gymData.activeWorkout.exercises.length;

    startWorkoutButton.innerHTML = "▶ Resume Workout";

   lastWorkoutSection.innerHTML = `
  <div
    class="exercise-card manage-card"
    id="lastWorkoutCard"
  >
    <div class="exercise-title">

      <h2>Last Workout</h2>

      <span class="chevron">
        ›
      </span>

    </div>

    <div class="exercise-summary">

      <span>
        ${formatWorkoutDate(lastWorkout.date)}
      </span>

      <span>
        ${lastWorkout.exercises.length} exercises
      </span>

    </div>
  </div>
`;

document
  .getElementById("lastWorkoutCard")
  ?.addEventListener("click", () => {

    showWorkoutHistoryDetail(lastWorkout.id);

  })
    return;
  }

  startWorkoutButton.innerHTML = "▶ New Workout";

  if (gymData.history.length === 0) {
    lastWorkoutSection.innerHTML = `
      <h2>Last Workout</h2>

      <p>
        No workouts recorded yet
      </p>
    `;

    return;
  }

  const lastWorkout = gymData.history[gymData.history.length - 1];

  lastWorkoutSection.innerHTML = `
  <div
    class="last-workout-card"
    id="lastWorkoutCard"
    role="button"
    tabindex="0"
  >
    <div class="exercise-title">
      <h2>Last Workout</h2>

      <span class="chevron">
        ›
      </span>
    </div>

    <p>
      ${formatWorkoutDate(lastWorkout.date)}
    </p>

    <p>
      ${lastWorkout.exercises.length} exercises
    </p>

    <p class="view-workout-text">
      View Workout
    </p>
  </div>
`;

const lastWorkoutCard = document.getElementById("lastWorkoutCard");

lastWorkoutCard.addEventListener("click", () => {
  showWorkoutHistoryDetail(lastWorkout.id);
});

lastWorkoutCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    showWorkoutHistoryDetail(lastWorkout.id);
  }
});
}

function formatActiveWorkoutStart(activeWorkout) {
  if (!activeWorkout.startedAt) {
    return "today";
  }

  const startedAt = new Date(activeWorkout.startedAt);
  const today = new Date();

  const isToday =
    startedAt.getFullYear() === today.getFullYear() &&
    startedAt.getMonth() === today.getMonth() &&
    startedAt.getDate() === today.getDate();

  const time = startedAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return isToday
    ? `today at ${time}`
    : startedAt.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
}

function formatLastUpdated(activeWorkout) {
  if (!activeWorkout.updatedAt) {
    return "just now";
  }

  const updated = new Date(activeWorkout.updatedAt);

  return updated.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showNewWorkoutModal() {
  const overlay = showModal(
    "🏋️ New Workout",
    `
      <p>
        Start today's workout
      </p>

      <button
        class="button-secondary"
        id="repeatWorkout"
      >
        🔁 Repeat Last Workout
      </button>

      <button
        class="button-secondary"
        id="useTemplate"
      >
        📋 Use Template
      </button>

      <button
        class="button-secondary"
        id="blankWorkout"
      >
        ➕ Blank Workout
      </button>
    `,
    "Cancel",
  );

  document
    .getElementById("useTemplate")
    .addEventListener("click", () => {
      overlay.remove();
      showWorkout();
    });

  document
  .getElementById("repeatWorkout")
  .addEventListener("click", () => {

    const gymData = loadData();

    if (gymData.history.length === 0) {

      overlay.remove();

      showModal(
        "No Previous Workout",
        `
          <p>
            You haven't completed a workout yet.
          </p>

          <p>
            Complete your first workout before using
            Repeat Last Workout.
          </p>
        `
      );

      return;
    }

    const lastWorkout =
      gymData.history[gymData.history.length - 1];

    gymData.activeWorkout =
      createActiveWorkoutFromWorkout(lastWorkout);

    saveData(gymData);

    overlay.remove();

    renderWorkout();

  });

  document
    .getElementById("blankWorkout")
    .addEventListener("click", () => {

        const gymData = loadData();

        gymData.activeWorkout = createBlankWorkout();

        saveData(gymData);

        overlay.remove();

        renderWorkout();

    });
}

function showWorkout() {
  const gymData = loadData();

  startOrResumeActiveWorkout(gymData);

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

if (activeWorkout.exercises.length === 0) {
    workoutHTML += `
        <div class="exercise-card">
            <h2>No exercises yet</h2>

            <p>
                Add your first exercise to begin today's workout.
            </p>

            <button id="addExercise">
                ➕ Add Exercise
            </button>
        </div>
    `;
}
  
  activeWorkout.exercises.forEach((exercise) => {
    workoutHTML += `
      <div class="exercise-card">
        <h2>${exercise.name}</h2>

        ${createSetRows(exercise)}

        <p>
  <strong>Rest:</strong>

  <span
    class="editable-rest"
    data-exercise-id="${exercise.id}"
  >
    ${exercise.rest}
  </span>
</p>
      </div>
    `;
  });

  workoutHTML += `
      <button class="button-success" id="completeWorkout">
        ✅ Complete Workout
      </button>

      <button class="button-secondary" id="returnHome">
        🏠 Return Home
      </button>
    </main>
  `;

  container.innerHTML = workoutHTML;

const addExerciseButton =
    document.getElementById("addExercise");

if (addExerciseButton) {

    addExerciseButton.addEventListener("click", () => {

        showAddExerciseModal();

    });

}

  document
    .getElementById("completeWorkout")
    .addEventListener("click", showCompleteWorkoutModal);

  document
    .getElementById("returnHome")
    .addEventListener("click", showDiscardWorkoutModal);

  attachWeightValueEditHandlers();
  attachWeightUnitEditHandlers();
  attachRepEditHandlers();
  attachRestEditHandlers();
  attachSetButtons();
}

function attachSetButtons() {
  document.querySelectorAll(".add-set").forEach((button) => {
    button.addEventListener("click", () => {
      const gymData = loadData();
      const exerciseId = Number(button.dataset.exerciseId);

      const exercise = gymData.activeWorkout.exercises.find(
        (item) => item.id === exerciseId,
      );

      const lastSet = exercise.sets[exercise.sets.length - 1];

      exercise.sets.push({
        setNumber: lastSet.setNumber + 1,
        weight: lastSet.weight
          ? {
              value: lastSet.weight.value,
              unit: lastSet.weight.unit,
            }
          : null,
        reps: lastSet.reps,
      });

      updateActiveWorkoutTimestamp(gymData);
      saveData(gymData);
      renderWorkout();
    });
  });

  document.querySelectorAll(".remove-set").forEach((button) => {
    button.addEventListener("click", () => {
      const gymData = loadData();
      const exerciseId = Number(button.dataset.exerciseId);

      const exercise = gymData.activeWorkout.exercises.find(
        (item) => item.id === exerciseId,
      );

      if (exercise.sets.length <= 1) {
        showModal(
          "Can't Remove Set",
          `
            <p>
              An exercise must contain at least one set.
            </p>
          `,
        );
        return;
      }

      exercise.sets.pop();

      updateActiveWorkoutTimestamp(gymData);
      saveData(gymData);
      renderWorkout();
    });
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
    const weightValue = set.weight ? set.weight.value : "-";
    const weightUnit = set.weight ? set.weight.unit : "";

    setsHTML += `
      <div class="set-row">
        <span>Set ${set.setNumber}</span>

        <span class="weight-cell">
          <span
            class="editable-weight-value"
            data-exercise-id="${exercise.id}"
            data-set-number="${set.setNumber}"
          >
            ${weightValue}
          </span>

          <span
            class="editable-weight-unit"
            data-exercise-id="${exercise.id}"
            data-set-number="${set.setNumber}"
          >
            ${weightUnit}
          </span>
        </span>

        <span class="reps-cell">
          <span
            class="editable-reps"
            data-exercise-id="${exercise.id}"
            data-set-number="${set.setNumber}"
          >
            ${set.reps}
          </span>

          <span>reps</span>
        </span>
      </div>
    `;
  });

  setsHTML += `</div>`;

setsHTML += `
  <div class="set-actions">

    <button
      class="small-button add-set"
      data-exercise-id="${exercise.id}"
    >
      ➕ Add Set
    </button>

    <button
      class="small-button remove-set"
      data-exercise-id="${exercise.id}"
    >
      ➖ Remove Last Set
    </button>

  </div>
`;

  return setsHTML;
}

function showCompleteWorkoutModal() {
  const gymData = loadData();
if (
  !gymData.activeWorkout ||
  gymData.activeWorkout.exercises.length === 0
) {
  showModal(
    "Nothing to Complete",
    `
      <p>
        Add at least one exercise before completing this workout.
      </p>
    `,
  );

  return;
}
  const exerciseCount = gymData.activeWorkout.exercises.length;

  const overlay = showModal(
    "🏁 Complete Workout",
    `
      <p>
        You are about to complete today's workout.
      </p>

      <p>
        <strong>${exerciseCount} exercises</strong> will be saved to your
        workout history.
      </p>

      <button class="button-success" id="confirmCompleteWorkout">
        ✅ Complete Workout
      </button>
    `,
    "Keep Training",
  );

  document
    .getElementById("confirmCompleteWorkout")
    .addEventListener("click", () => {
      completeActiveWorkout();

      overlay.remove();
      location.reload();
    });
}

function showDiscardWorkoutModal() {
  const overlay = showModal(
    "Discard Workout?",
    `
      <p>
        Your changes from this workout will be lost.
      </p>

      <button class="button-danger" id="confirmDiscardWorkout">
        Discard Workout
      </button>
    `,
    "Continue Workout",
  );

  document
    .getElementById("confirmDiscardWorkout")
    .addEventListener("click", () => {
      discardActiveWorkout();

      overlay.remove();
      location.reload();
    });
}

function showAddExerciseModal() {
  const overlay = showModal(
    "➕ Add Exercise",
    `
      <label class="form-label">
        Exercise Name

        <input
          id="exerciseName"
          class="inline-edit"
          type="text"
          placeholder="e.g. Face Pull"
        >
      </label>

      <p
        id="exerciseNameError"
        class="form-error"
        hidden
      >
        Please enter an exercise name.
      </p>

      <button
        class="button-success"
        id="nextExerciseStep"
      >
        Add Exercise
      </button>
    `,
    "Cancel",
  );

  const exerciseNameInput = document.getElementById("exerciseName");
  const exerciseNameError = document.getElementById("exerciseNameError");
  const nextButton = document.getElementById("nextExerciseStep");

  exerciseNameInput.focus();

  exerciseNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextButton.click();
    }
  });

  nextButton.addEventListener("click", () => {
    const exerciseName = exerciseNameInput.value
      .trim()
      .replace(/\s+/g, " ");

    if (!exerciseName) {
      exerciseNameError.hidden = false;
      exerciseNameInput.focus();
      return;
    }

    exerciseNameError.hidden = true;
    nextButton.disabled = true;

    overlay.remove();
    showExerciseDetailsModal(exerciseName);
  });
}

function showExerciseDetailsModal(exerciseName) {

    const gymData = loadData();

    const exercise = createExercise(exerciseName);

    gymData.activeWorkout.exercises.push(exercise);

    updateActiveWorkoutTimestamp(gymData);

    saveData(gymData);

    renderWorkout();

}

function completeActiveWorkout() {
  const gymData = loadData();

  if (!gymData.activeWorkout) {
    return;
  }

  gymData.activeWorkout.completedAt = new Date().toISOString();

  gymData.history.push(gymData.activeWorkout);
  gymData.activeWorkout = null;

  saveData(gymData);
}

function discardActiveWorkout() {
  const gymData = loadData();

  gymData.activeWorkout = null;

  saveData(gymData);
}

function attachWeightValueEditHandlers() {
  document.querySelectorAll(".editable-weight-value").forEach((element) => {
    element.addEventListener("click", () => {
      const currentValue = element.innerText.trim();

      element.innerHTML = `
        <input
          class="inline-edit"
          type="text"
          inputmode="decimal"
          value="${currentValue}"
        >
      `;

      const input = element.querySelector("input");

      input.focus();
      input.select();

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveEditedWeightValue(element, input.value);
        }
      });

      input.addEventListener("blur", () => {
        saveEditedWeightValue(element, input.value);
      });
    });
  });
}

function attachWeightUnitEditHandlers() {
  document.querySelectorAll(".editable-weight-unit").forEach((element) => {
    element.addEventListener("click", () => {
      const currentValue = element.innerText.trim();

      element.innerHTML = `
        <input
          class="inline-edit unit-edit"
          type="text"
          value="${currentValue}"
        >
      `;

      const input = element.querySelector("input");

      input.focus();
      input.select();

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveEditedWeightUnit(element, input.value);
        }
      });

      input.addEventListener("blur", () => {
        saveEditedWeightUnit(element, input.value);
      });
    });
  });
}

function attachRepEditHandlers() {
  document.querySelectorAll(".editable-reps").forEach((element) => {
    element.addEventListener("click", () => {
      const currentValue = element.innerText.trim();

      element.innerHTML = `
        <input
          class="inline-edit rep-edit"
          type="text"
          inputmode="numeric"
          value="${currentValue}"
        >
      `;

      const input = element.querySelector("input");

      input.focus();
      input.select();

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveEditedReps(element, input.value);
        }
      });

      input.addEventListener("blur", () => {
        saveEditedReps(element, input.value);
      });
    });
  });
}

function attachRestEditHandlers() {
  document.querySelectorAll(".editable-rest").forEach((element) => {
    element.addEventListener("click", () => {
      const currentValue = element.innerText.trim();

      element.innerHTML = `
        <input
          class="inline-edit"
          type="text"
          value="${currentValue}"
        >
      `;

      const input = element.querySelector("input");

      input.focus();
      input.select();

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveEditedRest(element, input.value);
        }
      });

      input.addEventListener("blur", () => {
        saveEditedRest(element, input.value);
      });
    });
  });
}
function saveEditedWeightValue(element, newValue) {
  const gymData = loadData();

  const exerciseId = Number(element.dataset.exerciseId);
  const setNumber = Number(element.dataset.setNumber);

  const exercise = gymData.activeWorkout.exercises.find(
    (item) => item.id === exerciseId,
  );

  const set = exercise.sets.find(
    (item) => item.setNumber === setNumber,
  );

  const parsedValue = Number(newValue);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    renderWorkout();
    return;
  }

  const previousValue = set.weight ? set.weight.value : 0;
  const unit = set.weight ? set.weight.unit : "kg";

  set.weight = {
    value: parsedValue,
    unit,
  };

  if (setNumber === 1) {
    exercise.sets.forEach((otherSet) => {
      if (
        otherSet.setNumber !== 1 &&
        otherSet.weight &&
        otherSet.weight.value === previousValue
      ) {
        otherSet.weight = {
          value: parsedValue,
          unit: otherSet.weight.unit || unit,
        };
      }
    });
  }

  updateActiveWorkoutTimestamp(gymData);
  saveData(gymData);
  renderWorkout();
}

function saveEditedWeightUnit(element, newUnit) {
  const gymData = loadData();
  const set = findSetFromElement(gymData, element);

  set.weight = {
    value: set.weight ? set.weight.value : 0,
    unit: newUnit.trim(),
  };

  updateActiveWorkoutTimestamp(gymData);
  saveData(gymData);
  renderWorkout();
}

function saveEditedReps(element, newReps) {
  const gymData = loadData();
  const set = findSetFromElement(gymData, element);
  const parsedReps = Number(newReps);

  if (!Number.isInteger(parsedReps) || parsedReps < 0) {
    renderWorkout();
    return;
  }

  set.reps = parsedReps;

  updateActiveWorkoutTimestamp(gymData);
  saveData(gymData);
  renderWorkout();
}

function saveEditedRest(element, newRest) {
  const gymData = loadData();

  const exerciseId = Number(element.dataset.exerciseId);

  const exercise = gymData.activeWorkout.exercises.find(
    (item) => item.id === exerciseId,
  );

  exercise.rest = newRest.trim();

  updateActiveWorkoutTimestamp(gymData);

  saveData(gymData);

  renderWorkout();
}

function updateActiveWorkoutTimestamp(gymData) {
  gymData.activeWorkout.updatedAt = new Date().toISOString();
}

function findSetFromElement(gymData, element) {
  const exerciseId = Number(element.dataset.exerciseId);
  const setNumber = Number(element.dataset.setNumber);

  const exercise = gymData.activeWorkout.exercises.find(
    (item) => item.id === exerciseId,
  );

  return exercise.sets.find((item) => item.setNumber === setNumber);
}