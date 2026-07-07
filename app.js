// =================================
// Gym Tracker
// Version 0.2
// =================================


document.addEventListener(
    "DOMContentLoaded",
    () => {


        const buttons =
            document.querySelectorAll("button");


        buttons.forEach(button => {


            button.addEventListener(
                "click",
                () => {


                    console.log(
                        button.innerText
                    );


                }
            );


        });


    }
);