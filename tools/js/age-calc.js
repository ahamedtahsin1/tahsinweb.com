document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("ageForm");

    const birthDateInput =
        document.getElementById("birthDate");

    const todayDateInput =
        document.getElementById("todayDate");

    const resultArea =
        document.getElementById("resultArea");

    const resetBtn =
        document.getElementById("resetBtn");


    const ageYears =
        document.getElementById("ageYears");

    const exactAge =
        document.getElementById("exactAge");

    const ageMonths =
        document.getElementById("ageMonths");

    const ageDays =
        document.getElementById("ageDays");

    const birthdayDays =
        document.getElementById("birthdayDays");

    const birthdayMessage =
        document.getElementById("birthdayMessage");


    const today = new Date();

    const todayString =
        formatDate(today);


    todayDateInput.value =
        todayString;

    todayDateInput.max =
        todayString;

    birthDateInput.max =
        todayString;


    function formatDate(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function daysBetween(start, end) {

        const startUTC =
            Date.UTC(
                start.getFullYear(),
                start.getMonth(),
                start.getDate()
            );

        const endUTC =
            Date.UTC(
                end.getFullYear(),
                end.getMonth(),
                end.getDate()
            );

        return Math.floor(
            (endUTC - startUTC) /
            86400000
        );
    }


    function calculateAge(birth, end) {

        let years =
            end.getFullYear() -
            birth.getFullYear();

        let months =
            end.getMonth() -
            birth.getMonth();

        let days =
            end.getDate() -
            birth.getDate();


        if (days < 0) {

            months--;

            const previousMonth =
                new Date(
                    end.getFullYear(),
                    end.getMonth(),
                    0
                );

            days +=
                previousMonth.getDate();
        }


        if (months < 0) {

            years--;

            months += 12;
        }


        return {
            years,
            months,
            days
        };
    }


    function getNextBirthday(
        birth,
        current
    ) {

        let nextBirthday =
            new Date(
                current.getFullYear(),
                birth.getMonth(),
                birth.getDate()
            );


        if (nextBirthday < current) {

            nextBirthday =
                new Date(
                    current.getFullYear() + 1,
                    birth.getMonth(),
                    birth.getDate()
                );
        }


        return nextBirthday;
    }


    function showResult() {

        resultArea.classList.remove(
            "show"
        );

        // Restart animation.
        void resultArea.offsetWidth;

        resultArea.classList.add(
            "show"
        );

        resultArea.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (
                !birthDateInput.value ||
                !todayDateInput.value
            ) {
                return;
            }


            const birth =
                new Date(
                    `${birthDateInput.value}T00:00:00`
                );

            const end =
                new Date(
                    `${todayDateInput.value}T00:00:00`
                );


            if (birth > end) {

                alert(
                    "The birth date cannot be after the calculation date."
                );

                return;
            }


            const age =
                calculateAge(
                    birth,
                    end
                );


            const totalDays =
                daysBetween(
                    birth,
                    end
                );


            ageYears.textContent =
                age.years.toLocaleString();


            exactAge.textContent =
                `${age.years} years, ` +
                `${age.months} months and ` +
                `${age.days} days`;


            ageMonths.textContent =
                (
                    age.years * 12 +
                    age.months
                ).toLocaleString();


            ageDays.textContent =
                totalDays.toLocaleString();


            const nextBirthday =
                getNextBirthday(
                    birth,
                    end
                );


            const daysToBirthday =
                daysBetween(
                    end,
                    nextBirthday
                );


            birthdayDays.textContent =
                daysToBirthday.toLocaleString();


            if (daysToBirthday === 0) {

                birthdayMessage.textContent =
                    "🎂 Happy Birthday! Today is your day!";

            } else if (daysToBirthday === 1) {

                birthdayMessage.textContent =
                    "🎈 Your birthday is tomorrow!";

            } else {

                birthdayMessage.textContent =
                    `🎂 Your next birthday is in ` +
                    `${daysToBirthday.toLocaleString()} days!`;
            }


            showResult();
        }
    );


    resetBtn.addEventListener(
        "click",
        () => {

            resultArea.classList.remove(
                "show"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            birthDateInput.focus();
        }
    );


    document.getElementById(
        "currentYear"
    ).textContent =
        new Date().getFullYear();

});