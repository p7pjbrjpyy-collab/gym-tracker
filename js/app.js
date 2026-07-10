// =================================
// Gym Tracker
// App Controller
// =================================

document.addEventListener("DOMContentLoaded", () => {
  const startWorkoutButton = document.getElementById("startWorkout");
  const manageWorkoutButton = document.getElementById("manageWorkout");
  const historyButton = document.getElementById("history");

  startWorkoutButton.addEventListener("click", () => {
    showWorkout();
  });

  manageWorkoutButton.addEventListener("click", () => {
    showManageWorkout();
  });

  historyButton.addEventListener("click", () => {
    showHistory();
  });
});

function showWorkout() {
  const gymData = loadData();

  gymData.activeWorkout = createActiveWorkoutFromTemplate(
    gymData.workoutTemplate,
  );

  saveData(gymData);
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
      <button class="button-success" id="completeWorkout">
        ✅ Complete Workout
      </button>

      <button class="button-secondary" id="returnHome">
        🏠 Return Home
      </button>
    </main>
  `;

  container.innerHTML = workoutHTML;

  document
    .getElementById("completeWorkout")
    .addEventListener("click", showCompleteWorkoutModal);

  document
    .getElementById("returnHome")
    .addEventListener("click", showDiscardWorkoutModal);

  attachWeightValueEditHandlers();
  attachWeightUnitEditHandlers();
  attachRepEditHandlers();
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

  return setsHTML;
}

function showCompleteWorkoutModal() {
  const gymData = loadData();
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

function saveEditedWeightValue(element, newValue) {
  const gymData = loadData();
  const set = findSetFromElement(gymData, element);
  const parsedValue = Number(newValue);

  if (Number.isNaN(parsedValue)) {
    renderWorkout();
    return;
  }

  set.weight = {
    value: parsedValue,
    unit: set.weight ? set.weight.unit : "kg",
  };

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

  saveData(gymData);
  renderWorkout();
}

function findSetFromElement(gymData, element) {
  const exerciseId = Number(element.dataset.exerciseId);
  const setNumber = Number(element.dataset.setNumber);

  const exercise = gymData.activeWorkout.exercises.find(
    (item) => item.id === exerciseId,
  );

  return exercise.sets.find((item) => item.setNumber === setNumber);
}