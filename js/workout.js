// =================================
// Workout Logic
// =================================

function createActiveWorkoutFromTemplate(workoutTemplate) {
    return {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        exercises: workoutTemplate.map((exercise) => {
            return {
                id: exercise.id,
                name: exercise.name,
                rest: exercise.rest,
                coachNote: exercise.coachNote || "",
                sets: createSetsForExercise(exercise)
            };
        })
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
            reps: exercise.reps
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
            unit: ""
        };
    }

    const unit = weightText.toLowerCase().includes("lb") ? "lb" : "kg";

    return {
        value,
        unit
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