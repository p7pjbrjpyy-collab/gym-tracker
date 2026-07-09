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
            weight: exercise.weight,
            reps: exercise.reps
        };
    });
}