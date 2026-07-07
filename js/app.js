// =================================
// Gym Tracker
// Version 0.3
// Workout Screen
// =================================


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const startWorkoutButton =
            document.getElementById("startWorkout");

        const manageWorkoutButton =
            document.getElementById("manageWorkout");


        startWorkoutButton.addEventListener(
            "click",
            () => {

                showWorkout();

            }
        );


        manageWorkoutButton.addEventListener(
            "click",
            () => {

                showManageWorkout();

            }
        );

    }
);



function showWorkout() {


    const container =
        document.querySelector(".container");


    let workoutHTML = `

        <header>

            <h1>💪 Today's Workout</h1>

            <p class="subtitle">
                Let's get started James
            </p>

        </header>

        <main>

    `;



    const gymData = loadData();

const workout = gymData.workoutTemplate;

workout.forEach(

        exercise => {


            workoutHTML += `

                <div class="exercise-card">

                    <h2>
                        ${exercise.name}
                    </h2>


                    <p>
                        <strong>Target:</strong>
                        ${exercise.sets} × ${exercise.reps}
                    </p>


                    <p>
                        <strong>Weight:</strong>
                        ${exercise.weight}
                    </p>


                    <p>
                        <strong>Rest:</strong>
                        ${exercise.rest}
                    </p>


                </div>

            `;


        }
    );



    workoutHTML += `

        </main>

        <button id="backHome">
            ← Back Home
        </button>

    `;



    container.innerHTML =
        workoutHTML;



    document
        .getElementById("backHome")
        .addEventListener(
            "click",
            () => {

                location.reload();

            }
        );


}