// tags needed
const typingText = document.querySelector(".typing-text p");
inpField = document.querySelector(".wrapper .input-field");
mistakeTag = document.querySelector(".mistake span");
missTag = document.querySelector(".miss span");
timeTag = document.querySelector(".time span b");
wpmTag = document.querySelector(".wpm span");
cpmTag = document.querySelector(".cpm span"),
tryAgain = document.querySelector("button#trytry");


// variable declarations
let charIndex = mistakes = 0;
let paralength = 0;
let made = 0;

let timer,
maxTime = 1,
timeLeft = maxTime,
isTyping = 0;

let cpm = gwpm = 0;
let nwpm = 0;
let cpw = 5;

let tmode;
let diffy;

let accuracy;

$("#starttest").click(function () {
    // show test
    $(".wrapper").show();
    $("#config").hide();
    randomParagraph();
});

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
    // The maximum is exclusive and the minimum is inclusive
}

function randomParagraph() {
    // mode
    tmode = $("#testmode").val();
    // difficulty
    diffy = $("#diffy").val();
    const modes = {
        "l0": [0, paragraphs.length, speeds.length],
        "l1": [0, 2, 2],
        "l2": [2, 4, 4],
        "l3": [4, 6, 6],
        "l4": [6, 8, 8],
        "l5": [8, 10, 10],
        "l6": [10, 12, 12],
        "l7": [12, 14, 14],
        "l8": [14, 16, 16],
        "l9": [16, 18, 18],
        "l10": [18, 20, 20]
    }
    if (tmode == "word") {
        let randIndex = getRandomInt(modes[diffy][0], modes[diffy][1]);
        // clear box
        typingText.innerHTML = "";
        paragraphs[randIndex].split("").forEach(span => {
            // add new character
            let spanTag = `<span>${span}</span>`
            typingText.innerHTML += spanTag;
        });
        // initialize first character
        typingText.querySelectorAll("span")[0].classList.add("active");
        // english characters per word
        cpw = 5;
    } else if (tmode == "speed") {
        let randIndex = getRandomInt(modes[diffy][0], modes[diffy][2]);
        // clear box
        typingText.innerHTML = "";
        speeds[randIndex].split("").forEach(span => {
            // add new character
            let spanTag = `<span>${span}</span>`
            typingText.innerHTML += spanTag;
        });
        // latin characters per word
        cpw = 6;
    }
    
    // document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    // get all characters in the paragraph
    const characters = typingText.querySelectorAll("span");
    // get user typed character
    let typedChar = inpField.value.split("")[charIndex];
    // check if paragraph finished or time's up
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            // start timer for the first time 
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        
        if (typedChar == null) {
            // move cursor back
            charIndex -= 2;
            if (characters[charIndex + 1].classList.contains("incorrect")) {
                mistakes--;
                // remove mistakes that are not fixed by 1
            }
            // decrease total typed characters
            paralength--;
            // remove all styling and colors
            characters[charIndex + 1].classList.remove("correct", "incorrect");
        } else {
            paralength++;
            if (characters[charIndex].innerText === typedChar) {
                // correct character
                characters[charIndex].classList.add("correct");
            } else {
                // increase mistakes not fixed
                mistakes++;
                // increase mistakes history
                made++;
                // incorrect character
                characters[charIndex].classList.add("incorrect");
            }
        }
        
        // incrementing character
        charIndex++;
        if (charIndex == characters.length - 1) {
            charIndex++;
            testOver();
        }
        // adding cursor
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");
        
        // accuracy
        let mistakeTagval = paralength > 0 ? ((((paralength - made) / paralength) * 100).toFixed(2)).toString() : "100.00"
        mistakeTagval = Number(mistakeTagval) <= 100 ? mistakeTagval : "100.00";
        accuracy = mistakeTagval > 0 ? mistakeTagval : "0.00"
        mistakeTag.innerText = `${accuracy} %`; 
        missTag.innerText = mistakes.toString();
    } else {
        // conditions met, test over
        inpField.value = "";
        clearInterval(timer);
        testOver();
    }
}

function initTimer() {
    if (timeLeft > 0) {
        // decrease time
        timeLeft--;
        timeTag.innerText = timeLeft.toString();
        // gross words per minute
        gwpm = (paralength / cpw) / ((maxTime - timeLeft) / 60);
        // net words per minute
        nwpm = (gwpm - ((mistakes / cpw) / ((maxTime - timeLeft) / 60)));
        nwpm = nwpm < 0 || !nwpm || nwpm === Infinity ? 0: nwpm;
        wpmTag.innerText = nwpm.toFixed(2).toString();
        // characters per minute
        cpm = (nwpm * cpw).toFixed(2);
        cpmTag.innerText = cpm.toString();
    } else {
        // stop timer
        clearInterval(timer);
        testOver();
    }
}


// try again
function resetTest() {
    // call random paragraph func
    randomParagraph();
    // reset all variables (most)
    charIndex = mistakes = 0;
    timeLeft = maxTime,
    isTyping = 0;
    cpm = gwpm = 0;
    nwpm = 0;
    cpw = 5;
    inpField.value = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft.toString();
    wpmTag.innerText = nwpm.toFixed(2).toString();
    cpmTag.innerText = cpm.toString();
}

var $modal = $("#myModal");
var $span = $(".close").first();


$span.click(function() {
    $modal.hide();
});

$(window).click(function(event) {
    if ($(event.target).is("#myModal")) {
        $modal.hide();
    }
});

// test over function
function testOver() {
    $(".modal-content span.passm").text(nwpm > 50 ? "passed" : "failed");
    $(".modal-content span.pem").text(nwpm > 50 ? "!" : "...");
    $(".modal-content h2.timem").text(`${maxTime - timeLeft} seconds`);
    $(".modal-content h2.wpmm").text(`${nwpm} WPM`);
    $(".modal-content h2.cpmm").text(`${Math.ceil(cpm)} CPM`);
    $(".modal-content h2.accm").text(`${accuracy}% correct`);
    const diffs = {
        "l0": "Random",
        "l1": "Level 1",
        "l2": "Level 2",
        "l3": "Level 3",
        "l4": "Level 4",
        "l5": "Level 5",
        "l6": "Level 6",
        "l7": "Level 7",
        "l8": "Level 8",
        "l9": "Level 9",
        "l10": "Level 10"
    }
    const modes = {
        "word": "Word Training",
        "speed": "Pure Speed Training"
    }
    $(".modal-content h2.diffym").text(`${diffs[diffy]} difficulty`);
    $(".modal-content h2.modem").text(`${modes[tmode]} mode`);
    $modal.show();
}

// call initTyping when typing
inpField.addEventListener("input", initTyping);
// try again button event listener
tryAgain.addEventListener("click", resetTest);
