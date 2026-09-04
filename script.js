function updateTime() {

    var currentTime = new Date().toLocaleString();

    document.querySelector("#time").textContent = currentTime;
}

updateTime();

setInterval(updateTime, 1000);

function closeWindow(element) {

    element.style.display = "none";
}


function openWindow(element) {

    element.style.display = "block";

    bringToFront(element);
}

var highestZIndex = 10;


function bringToFront(element) {

    highestZIndex++;

    element.style.zIndex = highestZIndex;
}

function dragElement(element) {

    if (!element) return;

    var startX;
    var startY;

    var startTop;
    var startLeft;

    var header =
        document.getElementById(element.id + "header") ||
        element;


    header.addEventListener("mousedown", startDragging);


    function startDragging(e) {

        if (e.target.closest(".window-controls")) {
            return;
        }

        e.preventDefault();

        bringToFront(element);

        var rect =
            element.getBoundingClientRect();

        var parentRect =
            element.offsetParent.getBoundingClientRect();


        element.style.top =
            (rect.top - parentRect.top) + "px";

        element.style.left =
            (rect.left - parentRect.left) + "px";

        element.style.transform = "none";


        startX = e.clientX;
        startY = e.clientY;

        startTop = element.offsetTop;
        startLeft = element.offsetLeft;


        document.addEventListener(
            "mousemove",
            dragging
        );

        document.addEventListener(
            "mouseup",
            stopDragging
        );
    }


    function dragging(e) {

        e.preventDefault();

        var deltaX =
            e.clientX - startX;

        var deltaY =
            e.clientY - startY;


        element.style.top =
            (startTop + deltaY) + "px";

        element.style.left =
            (startLeft + deltaX) + "px";
    }


    function stopDragging() {

        document.removeEventListener(
            "mousemove",
            dragging
        );

        document.removeEventListener(
            "mouseup",
            stopDragging
        );
    }
}

function setupWindowControls(windowElement) {

    var minimizeButton =
        windowElement.querySelector(".minimize-btn");

    var maximizeButton =
        windowElement.querySelector(".maximize-btn");

    var closeButton =
        windowElement.querySelector(".close-btn");

    minimizeButton.addEventListener("click", function() {

        windowElement.style.display = "none";

        deselectIcon(windowElement);

    });

    maximizeButton.addEventListener("click", function() {

        if (
            windowElement.classList.contains("maximized")
        ) {

            windowElement.classList.remove("maximized");

            maximizeButton.textContent = "□";

        } else {

            windowElement.classList.add("maximized");

            maximizeButton.textContent = "❐";

        }

    });

    closeButton.addEventListener("click", function() {

        closeWindow(windowElement);

        deselectIcon(windowElement);

    });
}

function deselectIcon(windowElement) {

    var icon = null;


    if (windowElement.id === "keepnotes") {
        icon = keepnotesOpen;
    }

    if (windowElement.id === "calculator") {
        icon = calculatorOpen;
    }

    if (windowElement.id === "contacts") {
        icon = contactsOpen;
    }

    if (windowElement.id === "gallery") {
        icon = galleryOpen;
    }

    if (windowElement.id === "focustimer") {
        icon = focustimerOpen;
    }


    if (icon) {

        icon.classList.remove("selected");

    }
}

var welcomeScreen =
    document.querySelector("#welcomescreen");

var welcomeOpen =
    document.querySelector("#openshaazos");


welcomeOpen.addEventListener("click", function() {

    openWindow(welcomeScreen);

});


dragElement(welcomeScreen);

setupWindowControls(welcomeScreen);

var keepnotes =
    document.querySelector("#keepnotes");

var keepnotesOpen =
    document.querySelector("#openkeepnotes");

var keepNotesSelected = false;


keepnotesOpen.addEventListener("click", function() {

    keepNotesSelected =
        !keepNotesSelected;


    keepnotesOpen.classList.toggle(
        "selected",
        keepNotesSelected
    );


    if (keepNotesSelected) {

        openWindow(keepnotes);

    } else {

        closeWindow(keepnotes);

    }

});


dragElement(keepnotes);

setupWindowControls(keepnotes);

var calculator =
    document.querySelector("#calculator");

var calculatorOpen =
    document.querySelector("#opencalculator");

var calculatorSelected = false;


calculatorOpen.addEventListener("click", function() {

    calculatorSelected =
        !calculatorSelected;


    calculatorOpen.classList.toggle(
        "selected",
        calculatorSelected
    );


    if (calculatorSelected) {

        openWindow(calculator);

    } else {

        closeWindow(calculator);

    }

});


dragElement(calculator);

setupWindowControls(calculator);

var display =
    document.querySelector("#calculator-display");

var calculatorButtons =
    document.querySelectorAll(".calculator-button");


var currentInput = "0";

var previousInput = null;

var operator = null;

var waitingForNumber = false;


function updateDisplay() {

    display.textContent = currentInput;

}


function inputNumber(number) {

    if (waitingForNumber) {

        currentInput = number;

        waitingForNumber = false;

    } else {

        if (
            number === "." &&
            currentInput.includes(".")
        ) {

            return;

        }


        if (
            currentInput === "0" &&
            number !== "."
        ) {

            currentInput = number;

        } else {

            currentInput += number;

        }

    }


    updateDisplay();
}


function chooseOperator(selectedOperator) {

    if (
        operator !== null &&
        !waitingForNumber
    ) {

        calculate();

    }


    previousInput =
        parseFloat(currentInput);

    operator =
        selectedOperator;

    waitingForNumber = true;
}


function calculate() {

    if (
        operator === null ||
        previousInput === null
    ) {

        return;

    }


    var currentNumber =
        parseFloat(currentInput);

    var result;


    switch (operator) {

        case "+":

            result =
                previousInput + currentNumber;

            break;


        case "−":

            result =
                previousInput - currentNumber;

            break;


        case "×":

            result =
                previousInput * currentNumber;

            break;


        case "÷":

            if (currentNumber === 0) {

                currentInput = "Error";

                previousInput = null;

                operator = null;

                waitingForNumber = true;

                updateDisplay();

                return;
            }


            result =
                previousInput / currentNumber;

            break;


        case "%":

            result =
                previousInput % currentNumber;

            break;

    }


    currentInput =
        String(Number(result.toFixed(10)));


    previousInput = null;

    operator = null;

    waitingForNumber = true;


    updateDisplay();
}


function clearCalculator() {

    currentInput = "0";

    previousInput = null;

    operator = null;

    waitingForNumber = false;

    updateDisplay();
}


function deleteNumber() {

    if (
        currentInput === "Error" ||
        currentInput.length <= 1
    ) {

        currentInput = "0";

    } else {

        currentInput =
            currentInput.slice(0, -1);

    }


    updateDisplay();
}


calculatorButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        var value =
            button.textContent;


        if (
            !isNaN(value) ||
            value === "."
        ) {

            inputNumber(value);

        }


        else if (
            value === "+" ||
            value === "−" ||
            value === "×" ||
            value === "÷" ||
            value === "%"
        ) {

            chooseOperator(value);

        }


        else if (value === "=") {

            calculate();

        }


        else if (value === "AC") {

            clearCalculator();

        }


        else if (value === "⌫") {

            deleteNumber();

        }

    });

});

var contacts =
    document.querySelector("#contacts");

var contactsOpen =
    document.querySelector("#opencontacts");

var contactsSelected = false;


contactsOpen.addEventListener("click", function() {

    contactsSelected =
        !contactsSelected;


    contactsOpen.classList.toggle(
        "selected",
        contactsSelected
    );


    if (contactsSelected) {

        openWindow(contacts);

    } else {

        closeWindow(contacts);

    }

});


dragElement(contacts);

setupWindowControls(contacts);

var gallery =
    document.querySelector("#gallery");

var galleryOpen =
    document.querySelector("#opengallery");

var gallerySelected = false;


galleryOpen.addEventListener("click", function() {

    gallerySelected =
        !gallerySelected;


    galleryOpen.classList.toggle(
        "selected",
        gallerySelected
    );


    if (gallerySelected) {

        openWindow(gallery);

    } else {

        closeWindow(gallery);

    }

});


dragElement(gallery);

setupWindowControls(gallery);

var focustimer =
    document.querySelector("#focustimer");

var focustimerOpen =
    document.querySelector("#openfocustimer");

var focustimerSelected = false;


focustimerOpen.addEventListener("click", function() {

    focustimerSelected =
        !focustimerSelected;


    focustimerOpen.classList.toggle(
        "selected",
        focustimerSelected
    );


    if (focustimerSelected) {

        openWindow(focustimer);

    } else {

        closeWindow(focustimer);

    }

});


dragElement(focustimer);

setupWindowControls(focustimer);

var timerDisplay =
    document.querySelector("#timer-display");

var timerButtons =
    document.querySelectorAll(
        ".timer-buttons button"
    );

var timerStart =
    document.querySelector("#timer-start");

var timerReset =
    document.querySelector("#timer-reset");


var timerSeconds = 5 * 60;

var timerInterval = null;

var timerRunning = false;


function updateTimerDisplay() {

    var minutes =
        Math.floor(timerSeconds / 60);

    var seconds =
        timerSeconds % 60;


    var minuteText =
        String(minutes).padStart(2, "0");

    var secondText =
        String(seconds).padStart(2, "0");


    timerDisplay.textContent =
        minuteText + ":" + secondText;
}


timerButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        var minutes =
            Number(button.dataset.minutes);


        clearInterval(timerInterval);

        timerRunning = false;

        timerStart.textContent = "Start";


        timerSeconds =
            minutes * 60;


        updateTimerDisplay();

    });

});


timerStart.addEventListener("click", function() {

    if (timerRunning) {

        clearInterval(timerInterval);

        timerRunning = false;

        timerStart.textContent = "Start";

        return;

    }


    if (timerSeconds <= 0) {
        return;
    }


    timerRunning = true;

    timerStart.textContent = "Pause";


    timerInterval =
        setInterval(function() {

            timerSeconds--;

            updateTimerDisplay();


            if (timerSeconds <= 0) {

                clearInterval(timerInterval);

                timerRunning = false;

                timerStart.textContent = "Start";

                alert("Focus session complete!");

            }

        }, 1000);

});


timerReset.addEventListener("click", function() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerStart.textContent = "Start";

    timerSeconds = 5 * 60;

    updateTimerDisplay();

});


updateTimerDisplay();

var searchInput =
    document.querySelector("#app-search-input");

var searchResults =
    document.querySelector("#app-search-results");


searchInput.addEventListener("input", function () {

    var searchText =
        searchInput.value.toLowerCase().trim();

    searchResults.innerHTML = "";


    if (searchText === "") {

        searchResults.style.display = "none";

        return;

    }


    var apps =
        document.querySelectorAll(".app-icon");


    var found = false;


    apps.forEach(function (app) {

        var appName =
            app.getAttribute("data-app");


        if (!appName) return;


        if (
            appName
                .toLowerCase()
                .includes(searchText)
        ) {

            found = true;


            var result =
                document.createElement("div");

            result.className =
                "search-result";

            result.textContent =
                appName;


            result.addEventListener(
                "click",
                function () {

                    app.click();

                    searchInput.value = "";

                    searchResults.style.display =
                        "none";

                }
            );


            searchResults.appendChild(result);

        }

    });


    if (found) {

        searchResults.style.display =
            "block";

    } else {

        searchResults.style.display =
            "none";

    }

});

var fileExplorer =
    document.querySelector("#fileexplorer");

var fileExplorerOpen =
    document.querySelector("#openfileexplorer");

var fileExplorerSelected = false;


fileExplorerOpen.addEventListener("click", function() {

    fileExplorerSelected =
        !fileExplorerSelected;


    fileExplorerOpen.classList.toggle(
        "selected",
        fileExplorerSelected
    );


    if (fileExplorerSelected) {

        openWindow(fileExplorer);

    } else {

        closeWindow(fileExplorer);

    }

});


dragElement(fileExplorer);

setupWindowControls(fileExplorer);

var currentFolder =
    document.querySelector("#current-folder");

var fileBack =
    document.querySelector("#file-back");

var fileItems =
    document.querySelectorAll(".file-item");


fileItems.forEach(function(item) {

    item.addEventListener("dblclick", function() {

        if (
            item.classList.contains("folder")
        ) {

            var folderName =
                item.dataset.folder;

            currentFolder.textContent =
                folderName;

        }

    });

});


fileBack.addEventListener("click", function() {

    currentFolder.textContent = "Home";

});

var settings =
    document.querySelector("#settings");

var settingsOpen =
    document.querySelector("#opensettings");

var settingsSelected = false;


settingsOpen.addEventListener("click", function() {

    settingsSelected =
        !settingsSelected;


    settingsOpen.classList.toggle(
        "selected",
        settingsSelected
    );


    if (settingsSelected) {

        openWindow(settings);

    } else {

        closeWindow(settings);

    }

});


dragElement(settings);

setupWindowControls(settings);

var wallpaperOptions =
    document.querySelectorAll(
        ".wallpaper-option"
    );


wallpaperOptions.forEach(function(button) {

    button.addEventListener("click", function() {

        var wallpaper =
            button.dataset.wallpaper;


        document.body.style.backgroundImage =
            "url('" + wallpaper + "')";


        localStorage.setItem(
            "shaazOS-wallpaper",
            wallpaper
        );

    });

});

var accentOptions =
    document.querySelectorAll(
        ".accent-option"
    );


accentOptions.forEach(function(button) {

    button.addEventListener("click", function() {

        var color =
            button.dataset.color;


        document.documentElement.style
            .setProperty(
                "--accent-color",
                color
            );


        localStorage.setItem(
            "shaazOS-accent",
            color
        );

    });

});

var savedWallpaper =
    localStorage.getItem(
        "shaazOS-wallpaper"
    );


var savedAccent =
    localStorage.getItem(
        "shaazOS-accent"
    );


if (savedWallpaper) {

    document.body.style.backgroundImage =
        "url('" + savedWallpaper + "')";

}


if (savedAccent) {

    document.documentElement.style
        .setProperty(
            "--accent-color",
            savedAccent
        );

}

var resetSettings =
    document.querySelector("#reset-settings");


resetSettings.addEventListener("click", function() {

    localStorage.removeItem(
        "shaazOS-wallpaper"
    );

    localStorage.removeItem(
        "shaazOS-accent"
    );


    document.body.style.backgroundImage =
        "url('images/walpaper-1.jpg')";


    document.documentElement.style
        .setProperty(
            "--accent-color",
            "#87CEEB"
        );

});

var fileContent =
    document.querySelector("#file-content");

var fileLocation =
    document.querySelector("#file-location");

var fileBack =
    document.querySelector("#file-back");

var fileHome =
    document.querySelector("#file-home");

var fileRefresh =
    document.querySelector("#file-refresh");

var fileSystem = {

    Home: {

        type: "folder",

        items: [

            {
                name: "Desktop",
                type: "folder"
            },

            {
                name: "Documents",
                type: "folder"
            },

            {
                name: "Downloads",
                type: "folder"
            },

            {
                name: "Pictures",
                type: "folder"
            },

            {
                name: "Projects",
                type: "folder"
            },

            {
                name: "Music",
                type: "folder"
            },

            {
                name: "README.txt",
                type: "file"
            }

        ]

    },


    Desktop: {

        type: "folder",

        items: [

            {
                name: "shaazOS.html",
                type: "file"
            },

            {
                name: "Desktop Notes.txt",
                type: "file"
            }

        ]

    },


    Documents: {

        type: "folder",

        items: [

            {
                name: "Notes.txt",
                type: "file"
            },

            {
                name: "School Work.txt",
                type: "file"
            },

            {
                name: "Ideas.txt",
                type: "file"
            }

        ]

    },


    Downloads: {

        type: "folder",

        items: [

            {
                name: "download.zip",
                type: "file"
            },

            {
                name: "project.zip",
                type: "file"
            }

        ]

    },


    Pictures: {

        type: "folder",

        items: [

            {
                name: "wallpaper.jpg",
                type: "file"
            },

            {
                name: "photo1.jpg",
                type: "file"
            },

            {
                name: "photo2.jpg",
                type: "file"
            }

        ]

    },


    Projects: {

        type: "folder",

        items: [

            {
                name: "shaazOS",
                type: "folder"
            },

            {
                name: "Website",
                type: "folder"
            },

            {
                name: "Calculator",
                type: "folder"
            }

        ]

    },


    Music: {

        type: "folder",

        items: [

            {
                name: "Music.mp3",
                type: "file"
            }

        ]

    },


    "shaazOS": {

        type: "folder",

        items: [

            {
                name: "index.html",
                type: "file"
            },

            {
                name: "style.css",
                type: "file"
            },

            {
                name: "script.js",
                type: "file"
            }

        ]

    },


    Website: {

        type: "folder",

        items: [

            {
                name: "index.html",
                type: "file"
            },

            {
                name: "style.css",
                type: "file"
            }

        ]

    },


    Calculator: {

        type: "folder",

        items: [

            {
                name: "calculator.html",
                type: "file"
            },

            {
                name: "calculator.css",
                type: "file"
            },

            {
                name: "calculator.js",
                type: "file"
            }

        ]

    }

};

var currentFolder = "Home";

function showFolder(folderName) {

    if (!fileContent) return;

    var folder =
        fileSystem[folderName];

    if (!folder) return;

    currentFolder =
        folderName;

    fileLocation.textContent =
        folderName;

    fileContent.innerHTML =
        "";


    folder.items.forEach(
        function(item) {

            var element =
                document.createElement("div");

            element.className =
                "file-item";


            if (item.type === "folder") {

                element.classList.add(
                    "folder"
                );

            }


            var icon =
                document.createElement("div");

            icon.className =
                "file-icon";


            if (item.type === "folder") {

                icon.textContent =
                    "📁";

            } else {

                icon.textContent =
                    getFileIcon(item.name);

            }


            var name =
                document.createElement("div");

            name.className =
                "file-name";

            name.textContent =
                item.name;


            element.appendChild(icon);

            element.appendChild(name);

            element.addEventListener(
                "click",
                function(e) {

                    e.stopPropagation();

                    var selected =
                        fileContent.querySelectorAll(
                            ".file-item.selected"
                        );

                    selected.forEach(
                        function(item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    element.classList.add(
                        "selected"
                    );

                }
            );

            element.addEventListener(
                "dblclick",
                function(e) {

                    e.stopPropagation();


                    if (
                        item.type === "folder"
                    ) {

                        if (
                            fileSystem[item.name]
                        ) {

                            showFolder(
                                item.name
                            );

                        }

                    } else {

                        openFile(
                            item.name
                        );

                    }

                }
            );


            fileContent.appendChild(
                element
            );

        }
    );

}

function getFileIcon(fileName) {

    var extension =
        fileName
            .split(".")
            .pop()
            .toLowerCase();


    if (extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png") {

        return "🖼️";

    }


    if (extension === "mp3") {

        return "🎵";

    }


    if (extension === "zip") {

        return "📦";

    }


    if (extension === "html") {

        return "🌐";

    }


    if (extension === "css") {

        return "🎨";

    }


    if (extension === "js") {

        return "📜";

    }


    if (extension === "txt") {

        return "📄";

    }


    return "📄";
}

function openFile(fileName) {

    alert(
        "You opened: " +
        fileName
    );

}

if (fileBack) {

    fileBack.addEventListener(
        "click",
        function() {

            if (
                currentFolder !== "Home"
            ) {

                showFolder("Home");

            }

        }
    );

}

if (fileHome) {

    fileHome.addEventListener(
        "click",
        function() {

            showFolder("Home");

        }
    );

}

if (fileRefresh) {

    fileRefresh.addEventListener(
        "click",
        function() {

            showFolder(
                currentFolder
            );

        }
    );

}

showFolder("Home");