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

function exportGymTrackerBackup() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    alert("No Gym Tracker data found to export.");
    return;
  }

  const blob = new Blob([savedData], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const date = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `gym-tracker-backup-${date}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

