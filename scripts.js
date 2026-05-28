const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength_bar");
const strengthText = document.getElementById("strength_text");
const feedback = document.getElementById("feedback");

passwordInput.addEventListener("input", analyzePassword);

function analyzePassword() {
    const password = passwordInput.value;
    let score = 0;
    let suggestions = [];

    if (password.length >= 8) {
        score++;
    } else {
        suggestions.push("Use at least 8 characters!");
    }

    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        suggestions.push("Add uppercase letters!");
    }

    if (/[a-z]/.test(password)) {
        score++;
    } else {
        suggestions.push("Add lowercase letters!");
    }

    if (/[0-9]/.test(password)) {
        score++;
    } else {
        suggestions.push("Add numbers!");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    } else {
        suggestions.push("Add special characters!");
    }

    updateUI(score, suggestions, password);
}

function calcEnt(password) {
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^A-Za-z0-9]/.test(password)) charset += 32;
    if (charset === 0) return 0;
    return Math.log2(Math.pow(charset, password.length)).toFixed(2);
}

function estimateCrackTime(entropy) {
    const guessesPerSecond = 1e9;
    const seconds = Math.pow(2, entropy) / guessesPerSecond;
    if (seconds < 60) return "Instantly";
    if (seconds < 3600) return "Minutes";
    if (seconds < 86400) return "Hours";
    if (seconds < 31536000) return "Years";
    return "Centuries";
}

function updateUI(score, suggestions, password) {
    const colors = ["red", "orange", "yellow", "lightgreen", "green"];
    const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

    strengthBar.style.width = `${score * 20}%`;
    strengthBar.style.background = colors[score - 1] || "red";

    const entropy = calcEnt(password);
    const crackTime = estimateCrackTime(entropy);
    strengthText.textContent = `${labels[score - 1] || "Very Weak"} | Entropy: ${entropy} bits | Crack time: ${crackTime}`;

    feedback.innerHTML = "";
    suggestions.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        feedback.appendChild(li);
    });
}
