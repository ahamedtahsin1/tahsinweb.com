/* ==========================================
   TAHSION QR CODE GENERATOR
   ========================================== */

const typeTabs = document.querySelectorAll(".type-tab");
const formSections = document.querySelectorAll(".form-section");

const generateBtn = document.getElementById("generateBtn");

const qrContainer = document.getElementById("qrcode");
const emptyState = document.getElementById("emptyState");

const downloadPng = document.getElementById("downloadPng");
const copyBtn = document.getElementById("copyBtn");

const foreground = document.getElementById("foreground");
const background = document.getElementById("background");

const foregroundValue = document.getElementById("foregroundValue");
const backgroundValue = document.getElementById("backgroundValue");

const qrSize = document.getElementById("qrSize");
const sizeValue = document.getElementById("sizeValue");

const toast = document.getElementById("toast");

let currentType = "url";
let currentQRCode = null;
let currentCanvas = null;


/* ==========================================
   TYPE SWITCHING
   ========================================== */

typeTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        typeTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        currentType = tab.dataset.type;

        formSections.forEach(section => {
            section.classList.remove("active");
        });

        const selectedSection =
            document.getElementById(`${currentType}-section`);

        if (selectedSection) {
            selectedSection.classList.add("active");
        }

    });

});


/* ==========================================
   COLOR DISPLAY
   ========================================== */

foreground.addEventListener("input", () => {
    foregroundValue.textContent =
        foreground.value.toUpperCase();
});

background.addEventListener("input", () => {
    backgroundValue.textContent =
        background.value.toUpperCase();
});


/* ==========================================
   SIZE
   ========================================== */

qrSize.addEventListener("input", () => {

    sizeValue.textContent =
        `${qrSize.value}px`;

});


/* ==========================================
   GET DATA
   ========================================== */

function getQRData() {

    switch (currentType) {

        case "url": {

            const value =
                document.getElementById("urlInput").value.trim();

            if (!value) {
                showToast("Please enter a website URL.");
                return null;
            }

            return value;
        }


        case "text": {

            const value =
                document.getElementById("textInput").value.trim();

            if (!value) {
                showToast("Please enter some text.");
                return null;
            }

            return value;
        }


        case "phone": {

            const value =
                document.getElementById("phoneInput").value.trim();

            if (!value) {
                showToast("Please enter a phone number.");
                return null;
            }

            return `tel:${value}`;
        }


        case "email": {

            const email =
                document.getElementById("emailInput").value.trim();

            const subject =
                document.getElementById("emailSubject").value.trim();

            const body =
                document.getElementById("emailBody").value.trim();

            if (!email) {
                showToast("Please enter an email address.");
                return null;
            }

            const params = [];

            if (subject) {
                params.push(
                    `subject=${encodeURIComponent(subject)}`
                );
            }

            if (body) {
                params.push(
                    `body=${encodeURIComponent(body)}`
                );
            }

            return `mailto:${email}` +
                (params.length ? `?${params.join("&")}` : "");
        }


        case "wifi": {

            const ssid =
                document.getElementById("wifiName").value;

            const password =
                document.getElementById("wifiPassword").value;

            const security =
                document.getElementById("wifiSecurity").value;

            const hidden =
                document.getElementById("wifiHidden").checked;

            if (!ssid.trim()) {
                showToast("Please enter the Wi-Fi network name.");
                return null;
            }

            /*
                Escape characters used by Wi-Fi QR format.
            */

            const escapeWifi = value => {

                return value
                    .replace(/\\/g, "\\\\")
                    .replace(/;/g, "\\;")
                    .replace(/,/g, "\\,")
                    .replace(/:/g, "\\:");

            };

            return (
                `WIFI:` +
                `T:${security};` +
                `S:${escapeWifi(ssid)};` +
                `P:${escapeWifi(password)};` +
                `H:${hidden ? "true" : "false"};;`
            );
        }


        default:
            return null;
    }

}


/* ==========================================
   GENERATE QR
   ========================================== */

function generateQRCode() {

    const data = getQRData();

    if (!data) {
        return;
    }

    qrContainer.innerHTML = "";

    const size = Number(qrSize.value);

    currentQRCode = new QRCode(qrContainer, {

        text: data,

        width: size,
        height: size,

        colorDark: foreground.value,
        colorLight: background.value,

        correctLevel: QRCode.CorrectLevel.H

    });


    emptyState.style.display = "none";
    qrContainer.style.display = "block";

    downloadPng.disabled = false;
    copyBtn.disabled = false;


    /*
       qrcodejs generates the image/canvas asynchronously.
       Give the browser a moment before reading it.
    */

    setTimeout(() => {

        currentCanvas =
            qrContainer.querySelector("canvas");

        if (!currentCanvas) {

            const image =
                qrContainer.querySelector("img");

            if (image) {

                const canvas =
                    document.createElement("canvas");

                canvas.width = image.width;
                canvas.height = image.height;

                const context =
                    canvas.getContext("2d");

                context.drawImage(
                    image,
                    0,
                    0
                );

                currentCanvas = canvas;
            }
        }

    }, 100);

}


/* ==========================================
   GENERATE BUTTON
   ========================================== */

generateBtn.addEventListener(
    "click",
    generateQRCode
);


/* ==========================================
   DOWNLOAD PNG
   ========================================== */

downloadPng.addEventListener("click", () => {

    if (!currentCanvas) {

        currentCanvas =
            qrContainer.querySelector("canvas");

    }

    if (!currentCanvas) {

        showToast("Please generate a QR code first.");
        return;
    }


    const link =
        document.createElement("a");

    link.download =
        "tahsion-qr-code.png";

    link.href =
        currentCanvas.toDataURL("image/png");

    link.click();

    showToast("QR code downloaded successfully.");

});


/* ==========================================
   COPY QR
   ========================================== */

copyBtn.addEventListener("click", async () => {

    if (!currentCanvas) {

        currentCanvas =
            qrContainer.querySelector("canvas");

    }

    if (!currentCanvas) {

        showToast("Please generate a QR code first.");
        return;
    }


    try {

        const blob =
            await new Promise(resolve => {

                currentCanvas.toBlob(
                    resolve,
                    "image/png"
                );

            });


        await navigator.clipboard.write([
            new ClipboardItem({
                "image/png": blob
            })
        ]);

        showToast("QR code copied to clipboard.");

    } catch (error) {

        showToast(
            "Copy isn't supported here. Download the PNG instead."
        );

    }

});


/* ==========================================
   ENTER KEY
   ========================================== */

document.addEventListener("keydown", event => {

    if (
        event.ctrlKey &&
        event.key === "Enter"
    ) {

        generateQRCode();

    }

});


/* ==========================================
   TOAST
   ========================================== */

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2600);

}


/* ==========================================
   FAQ + YEAR
   ========================================== */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* ==========================================
   OPTIONAL: AUTO GENERATE URL
   ========================================== */

const urlInput =
    document.getElementById("urlInput");

urlInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        generateQRCode();

    }

});