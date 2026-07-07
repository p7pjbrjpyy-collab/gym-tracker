// =================================
// Gym Tracker Storage
// =================================

const STORAGE_KEY = "gymTrackerData";

function createDefaultData() {
    return {
        workoutTemplate: structuredClone(defaultWorkout),
        activeWorkout: null,
        history: [],
        settings: {
            units: "kg"
        }
    };
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        return JSON.parse(saved);
    }

    const data = createDefaultData();

    saveData(data);

    return data;
}

function saveData(data) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

function resetData() {
    localStorage.removeItem(STORAGE_KEY);
}