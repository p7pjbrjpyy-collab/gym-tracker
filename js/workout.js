// =================================
// Workout Logic
// =================================

function startOrResumeActiveWorkout(gymData) {
  if (gymData.activeWorkout) {
    return gymData.activeWorkout;
  }

  gymData.activeWorkout = createActiveWorkoutFromTemplate(
    gymData.workoutTemplate,
  );

  saveData(gymData);

  return gymData.activeWorkout;
}

function createActiveWorkoutFromTemplate(workoutTemplate) {
  const now = new Date().toISOString();

  return {
    id: Date.now(),
    date: getLocalDateString(),
    startedAt: now,
    updatedAt: now,
    exercises: workoutTemplate.map((exercise) => {
      return {
        id: exercise.id,
        name: exercise.name,
        rest: exercise.rest,
        coachNote: exercise.coachNote || "",
        sets: createSetsForExercise(exercise),
      };
    }),
  };
}

function createActiveWorkoutFromWorkout(workout) {
    return {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),

        exercises: workout.exercises.map((exercise) => {
            return {
                id: exercise.id,
                name: exercise.name,
                rest: exercise.rest,
                coachNote: exercise.coachNote || "",

                sets: exercise.sets.map((set) => {
                    return {
                        setNumber: set.setNumber,

                        weight: set.weight
                            ? {
                                  value: set.weight.value,
                                  unit: set.weight.unit
                              }
                            : null,

                        reps: set.reps
                    };
                })
            };
        })
    };
}

function createBlankWorkout() {
    return {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),

        exercises: []
    };
}

function createSetsForExercise(exercise) {
  const numberOfSets = Number(exercise.sets);

  if (!numberOfSets) {
    return [];
  }

  return Array.from({ length: numberOfSets }, (_, index) => {
    return {
      setNumber: index + 1,
      weight: parseWeight(exercise.weight),
      reps: exercise.reps,
    };
  });
}

function parseWeight(weightText) {
  if (!weightText || weightText === "-") {
    return null;
  }

  const value = parseFloat(weightText);

  if (Number.isNaN(value)) {
    return {
      value: weightText,
      unit: "",
    };
  }

  const unit = weightText.toLowerCase().includes("lb") ? "lb" : "kg";

  return {
    value,
    unit,
  };
}

function formatWeight(weight) {
  if (!weight) {
    return "-";
  }

  if (typeof weight === "string") {
    return weight;
  }

  if (typeof weight.value === "string") {
    return weight.value;
  }

  return `${weight.value} ${weight.unit}`.trim();
}

function getLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}