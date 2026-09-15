document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       AUTOMATIC COPYRIGHT YEAR
    ========================================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }



    /* =========================================
       HELPER FUNCTION
    ========================================= */

    function formatNumber(value) {

        if (!Number.isFinite(value)) {
            return "0";
        }

        return value.toLocaleString("en-US", {
            maximumFractionDigits: 10
        });

    }


    function showResult(element, label, value) {

        element.innerHTML = `
            <span class="result-label">${label}</span>
            <span class="result-value">${value}</span>
        `;

        element.classList.add("show");

    }


    function hideResult(element) {

        element.classList.remove("show");

        element.innerHTML = "";

    }



    /* =========================================
       CALCULATOR 1
       WHAT IS X% OF Y?
    ========================================= */

    const percentageOfForm =
        document.getElementById("percentageOfForm");

    const percentageInput =
        document.getElementById("percentage");

    const numberInput =
        document.getElementById("number");

    const percentageOfResult =
        document.getElementById("percentageOfResult");


    percentageOfForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const percentage =
            parseFloat(percentageInput.value);

        const number =
            parseFloat(numberInput.value);


        if (
            !Number.isFinite(percentage) ||
            !Number.isFinite(number)
        ) {

            showResult(
                percentageOfResult,
                "Error",
                "Please enter valid numbers."
            );

            return;

        }


        const answer =
            (percentage / 100) * number;


        showResult(
            percentageOfResult,
            `${formatNumber(percentage)}% of ${formatNumber(number)}`,
            formatNumber(answer)
        );

    });


    percentageInput.addEventListener("input", function () {
        hideResult(percentageOfResult);
    });


    numberInput.addEventListener("input", function () {
        hideResult(percentageOfResult);
    });



    /* =========================================
       CALCULATOR 2
       X IS WHAT PERCENTAGE OF Y?
    ========================================= */

    const whatPercentForm =
        document.getElementById("whatPercentForm");

    const partInput =
        document.getElementById("part");

    const wholeInput =
        document.getElementById("whole");

    const whatPercentResult =
        document.getElementById("whatPercentResult");


    whatPercentForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const part =
            parseFloat(partInput.value);

        const whole =
            parseFloat(wholeInput.value);


        if (
            !Number.isFinite(part) ||
            !Number.isFinite(whole)
        ) {

            showResult(
                whatPercentResult,
                "Error",
                "Please enter valid numbers."
            );

            return;

        }


        if (whole === 0) {

            showResult(
                whatPercentResult,
                "Error",
                "The second number cannot be 0."
            );

            return;

        }


        const answer =
            (part / whole) * 100;


        showResult(
            whatPercentResult,
            `${formatNumber(part)} is what percentage of ${formatNumber(whole)}?`,
            `${formatNumber(answer)}%`
        );

    });


    partInput.addEventListener("input", function () {
        hideResult(whatPercentResult);
    });


    wholeInput.addEventListener("input", function () {
        hideResult(whatPercentResult);
    });



    /* =========================================
       CALCULATOR 3
       PERCENTAGE INCREASE / DECREASE
    ========================================= */

    const changeForm =
        document.getElementById("changeForm");

    const originalInput =
        document.getElementById("original");

    const newInput =
        document.getElementById("newValue");

    const changeResult =
        document.getElementById("changeResult");


    changeForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const original =
            parseFloat(originalInput.value);

        const newValue =
            parseFloat(newInput.value);


        if (
            !Number.isFinite(original) ||
            !Number.isFinite(newValue)
        ) {

            showResult(
                changeResult,
                "Error",
                "Please enter valid numbers."
            );

            return;

        }


        if (original === 0) {

            showResult(
                changeResult,
                "Error",
                "Original value cannot be 0."
            );

            return;

        }


        const change =
            ((newValue - original) / Math.abs(original)) * 100;


        if (change > 0) {

            showResult(
                changeResult,
                "Percentage Increase",
                `${formatNumber(change)}% increase`
            );

        }

        else if (change < 0) {

            showResult(
                changeResult,
                "Percentage Decrease",
                `${formatNumber(Math.abs(change))}% decrease`
            );

        }

        else {

            showResult(
                changeResult,
                "Percentage Change",
                "0% — No change"
            );

        }

    });


    originalInput.addEventListener("input", function () {
        hideResult(changeResult);
    });


    newInput.addEventListener("input", function () {
        hideResult(changeResult);
    });


});