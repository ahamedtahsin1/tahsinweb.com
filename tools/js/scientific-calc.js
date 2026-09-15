document.addEventListener("DOMContentLoaded", () => {

    const expressionDisplay =
        document.getElementById("expression");

    const resultDisplay =
        document.getElementById("result");

    const displayStatus =
        document.getElementById("displayStatus");

    const buttons =
        document.querySelectorAll(
            ".keypad button"
        );

    const historyList =
        document.getElementById("historyList");

    const historyCount =
        document.getElementById("historyCount");

    const memoryIndicator =
        document.getElementById(
            "memoryIndicator"
        );

    const precisionSelect =
        document.getElementById(
            "precision"
        );

    const toast =
        document.getElementById("toast");


    let expression = "";

    let answer = 0;

    let memory = 0;

    let angleMode = "DEG";

    let history = [];


    /* =========================
       LOCAL HISTORY
    ========================= */

    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "tahsionCalcHistory"
                )
            ) || [];

    } catch {

        history = [];
    }


    renderHistory();

    updateMemoryIndicator();


    /* =========================
       DISPLAY
    ========================= */

    function updateDisplay() {

        expressionDisplay.textContent =
            expression || "0";

    }


    function formatNumber(value) {

        if (
            typeof value !== "number" ||
            !Number.isFinite(value)
        ) {
            return "Error";
        }


        if (
            Math.abs(value) < 1e-12
        ) {
            value = 0;
        }


        const precision =
            Number(
                precisionSelect.value
            );


        return Number(
            value.toPrecision(precision)
        ).toString();
    }


    /* =========================
       ANGLES
    ========================= */

    function toRadians(value) {

        if (angleMode === "DEG") {

            return (
                value *
                Math.PI /
                180
            );
        }


        if (angleMode === "GRAD") {

            return (
                value *
                Math.PI /
                200
            );
        }


        return value;
    }


    function fromRadians(value) {

        if (angleMode === "DEG") {

            return (
                value *
                180 /
                Math.PI
            );
        }


        if (angleMode === "GRAD") {

            return (
                value *
                200 /
                Math.PI
            );
        }


        return value;
    }


    /* =========================
       FACTORIAL
    ========================= */

    function factorial(n) {

        if (
            n < 0 ||
            !Number.isInteger(n)
        ) {
            throw new Error(
                "Invalid factorial"
            );
        }


        if (n > 170) {

            throw new Error(
                "Number too large"
            );
        }


        let result = 1;


        for (
            let i = 2;
            i <= n;
            i++
        ) {

            result *= i;
        }


        return result;
    }


    /* =========================
       EXPRESSION TRANSFORM
    ========================= */

    function transformExpression(expr) {

        let output = expr;


        /* Constants */

        output =
            output.replaceAll(
                "π",
                "Math.PI"
            );


        output =
            output.replace(
                /\be\b/g,
                "Math.E"
            );


        output =
            output.replaceAll(
                "×",
                "*"
            );


        output =
            output.replaceAll(
                "÷",
                "/"
            );


        output =
            output.replaceAll(
                "−",
                "-"
            );


        /* Ans */

        output =
            output.replaceAll(
                "Ans",
                "ANS"
            );


        /* Trigonometry */

        output =
            output.replace(
                /sin\(/g,
                "SIN("
            );


        output =
            output.replace(
                /cos\(/g,
                "COS("
            );


        output =
            output.replace(
                /tan\(/g,
                "TAN("
            );


        output =
            output.replace(
                /asin\(/g,
                "ASIN("
            );


        output =
            output.replace(
                /acos\(/g,
                "ACOS("
            );


        output =
            output.replace(
                /atan\(/g,
                "ATAN("
            );


        /* Hyperbolic */

        output =
            output.replace(
                /sinh\(/g,
                "Math.sinh("
            );


        output =
            output.replace(
                /cosh\(/g,
                "Math.cosh("
            );


        output =
            output.replace(
                /tanh\(/g,
                "Math.tanh("
            );


        /* Other functions */

        output =
            output.replace(
                /sqrt\(/g,
                "Math.sqrt("
            );


        output =
            output.replace(
                /cbrt\(/g,
                "Math.cbrt("
            );


        output =
            output.replace(
                /abs\(/g,
                "Math.abs("
            );


        output =
            output.replace(
                /log\(/g,
                "Math.log10("
            );


        output =
            output.replace(
                /ln\(/g,
                "Math.log("
            );


        output =
            output.replace(
                /exp\(/g,
                "Math.exp("
            );


        /* Powers */

        output =
            output.replace(
                /(\d+(?:\.\d+)?)\^2/g,
                "($1**2)"
            );


        output =
            output.replace(
                /(\d+(?:\.\d+)?)\^3/g,
                "($1**3)"
            );


        output =
            output.replace(
                /10\^/g,
                "10**"
            );


        output =
            output.replace(
                /\^/g,
                "**"
            );


        /* Percentage */

        output =
            output.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );


        /* Factorial */

        output =
            output.replace(
                /(\d+(?:\.\d+)?)!/g,
                "FACT($1)"
            );


        return output;
    }


    /* =========================
       CALCULATE
    ========================= */

    function calculate() {

        if (!expression) {

            return;
        }


        try {

            const transformed =
                transformExpression(
                    expression
                );


            const SIN =
                value =>
                    Math.sin(
                        toRadians(value)
                    );


            const COS =
                value =>
                    Math.cos(
                        toRadians(value)
                    );


            const TAN =
                value =>
                    Math.tan(
                        toRadians(value)
                    );


            const ASIN =
                value =>
                    fromRadians(
                        Math.asin(value)
                    );


            const ACOS =
                value =>
                    fromRadians(
                        Math.acos(value)
                    );


            const ATAN =
                value =>
                    fromRadians(
                        Math.atan(value)
                    );


            const FACT =
                factorial;


            const ANS =
                answer;


            const value =
                Function(
                    "SIN",
                    "COS",
                    "TAN",
                    "ASIN",
                    "ACOS",
                    "ATAN",
                    "FACT",
                    "ANS",
                    `"use strict";
                     return (${transformed})`
                )(
                    SIN,
                    COS,
                    TAN,
                    ASIN,
                    ACOS,
                    ATAN,
                    FACT,
                    ANS
                );


            if (
                typeof value !== "number" ||
                !Number.isFinite(value)
            ) {

                throw new Error(
                    "Invalid result"
                );
            }


            answer = value;


            const formatted =
                formatNumber(value);


            resultDisplay.textContent =
                formatted;


            displayStatus.textContent =
                "Calculation complete";


            addHistory(
                expression,
                formatted
            );


        } catch {

            resultDisplay.textContent =
                "Error";


            displayStatus.textContent =
                "Invalid expression";
        }

    }


    /* =========================
       INPUT
    ========================= */

    function addValue(value) {

        expression += value;

        updateDisplay();

        displayStatus.textContent =
            "Editing";
    }


    function clearCalculator() {

        expression = "";

        expressionDisplay.textContent =
            "0";

        resultDisplay.textContent =
            "0";

        displayStatus.textContent =
            "Ready";
    }


    function backspace() {

        expression =
            expression.slice(
                0,
                -1
            );

        updateDisplay();
    }


    /* =========================
       BUTTONS
    ========================= */

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.value;

                const action =
                    button.dataset.action;


                if (
                    action === "clear"
                ) {

                    clearCalculator();

                    return;
                }


                if (
                    action === "backspace"
                ) {

                    backspace();

                    return;
                }


                if (value === "=") {

                    calculate();

                    return;
                }


                addValue(value);
            }
        );

    });


    /* =========================
       ANGLE MODE
    ========================= */

    const degBtn =
        document.getElementById(
            "degBtn"
        );

    const radBtn =
        document.getElementById(
            "radBtn"
        );

    const gradBtn =
        document.getElementById(
            "gradBtn"
        );


    function setAngleMode(
        mode,
        activeButton
    ) {

        angleMode = mode;


        document
            .querySelectorAll(
                ".angle-btn"
            )
            .forEach(button => {

                button.classList.remove(
                    "active"
                );

            });


        activeButton.classList.add(
            "active"
        );


        displayStatus.textContent =
            mode + " mode";
    }


    degBtn.addEventListener(
        "click",
        () =>
            setAngleMode(
                "DEG",
                degBtn
            )
    );


    radBtn.addEventListener(
        "click",
        () =>
            setAngleMode(
                "RAD",
                radBtn
            )
    );


    gradBtn.addEventListener(
        "click",
        () =>
            setAngleMode(
                "GRAD",
                gradBtn
            )
    );


    /* =========================
       MEMORY
    ========================= */

    function updateMemoryIndicator() {

        if (memory !== 0) {

            memoryIndicator.classList.add(
                "active"
            );

        } else {

            memoryIndicator.classList.remove(
                "active"
            );
        }
    }


    document
        .querySelectorAll(
            "[data-memory]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.memory;


                    if (
                        action === "clear"
                    ) {

                        memory = 0;
                    }


                    if (
                        action === "recall"
                    ) {

                        expression +=
                            formatNumber(
                                memory
                            );

                        updateDisplay();
                    }


                    if (
                        action === "add"
                    ) {

                        memory += answer;
                    }


                    if (
                        action === "subtract"
                    ) {

                        memory -= answer;
                    }


                    if (
                        action === "store"
                    ) {

                        memory = answer;
                    }


                    updateMemoryIndicator();

                }
            );

        });


    /* =========================
       HISTORY
    ========================= */

    function addHistory(
        expressionValue,
        resultValue
    ) {

        history.unshift({

            expression:
                expressionValue,

            result:
                resultValue,

            time:
                Date.now()

        });


        history =
            history.slice(0, 30);


        saveHistory();

        renderHistory();
    }


    function saveHistory() {

        localStorage.setItem(
            "tahsionCalcHistory",
            JSON.stringify(history)
        );
    }


    function renderHistory() {

        historyCount.textContent =
            history.length;


        if (!history.length) {

            historyList.innerHTML = `

                <div class="empty-history">

                    <div class="empty-icon">
                        ∑
                    </div>

                    <strong>
                        No calculations yet
                    </strong>

                    <p>
                        Your recent calculations
                        will appear here.
                    </p>

                </div>

            `;

            return;
        }


        historyList.innerHTML =
            history.map(
                (item, index) => `

                <div
                    class="history-item"
                    data-history="${index}"
                >

                    <div
                        class="history-expression"
                    >
                        ${escapeHTML(
                            item.expression
                        )}
                    </div>

                    <div
                        class="history-result"
                    >
                        = ${escapeHTML(
                            item.result
                        )}
                    </div>

                </div>

                `
            ).join("");


        document
            .querySelectorAll(
                ".history-item"
            )
            .forEach(item => {

                item.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                item.dataset.history
                            );

                        const selected =
                            history[index];


                        expression =
                            selected.expression;

                        resultDisplay.textContent =
                            selected.result;

                        expressionDisplay.textContent =
                            selected.expression;

                        displayStatus.textContent =
                            "History loaded";
                    }
                );

            });
    }


    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    function clearAllHistory() {

        history = [];

        saveHistory();

        renderHistory();

        showToast(
            "Calculation history cleared"
        );
    }


    document
        .getElementById(
            "clearHistory"
        )
        .addEventListener(
            "click",
            clearAllHistory
        );


    document
        .getElementById(
            "clearHistoryBtn"
        )
        .addEventListener(
            "click",
            clearAllHistory
        );


    /* =========================
       COPY RESULT
    ========================= */

    document
        .getElementById(
            "copyResultBtn"
        )
        .addEventListener(
            "click",
            async () => {

                const value =
                    resultDisplay.textContent;


                if (
                    !value ||
                    value === "0" ||
                    value === "Error"
                ) {

                    return;
                }


                try {

                    await navigator.clipboard.writeText(
                        value
                    );


                    showToast(
                        "Result copied"
                    );

                } catch {

                    showToast(
                        "Copy unavailable"
                    );
                }

            }
        );


    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 1800);
    }


    /* =========================
       KEYBOARD
    ========================= */

    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key;


            if (
                /^[0-9.]$/.test(key)
            ) {

                addValue(key);

                return;
            }


            if (
                ["+", "-", "*", "/",
                 "(", ")"].includes(key)
            ) {

                let converted =
                    key;


                if (key === "*") {
                    converted = "×";
                }


                if (key === "/") {
                    converted = "÷";
                }


                if (key === "-") {
                    converted = "−";
                }


                addValue(converted);

                return;
            }


            if (
                key === "Enter" ||
                key === "="
            ) {

                event.preventDefault();

                calculate();

                return;
            }


            if (
                key === "Backspace"
            ) {

                backspace();

                return;
            }


            if (
                key === "Escape"
            ) {

                clearCalculator();
            }

        }
    );


    /* =========================
       PRECISION
    ========================= */

    precisionSelect.addEventListener(
        "change",
        () => {

            if (
                Number.isFinite(answer)
            ) {

                resultDisplay.textContent =
                    formatNumber(answer);
            }

        }
    );


    /* =========================
       YEAR
    ========================= */

    document.getElementById(
        "currentYear"
    ).textContent =
        new Date().getFullYear();

});