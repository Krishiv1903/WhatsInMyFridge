const state = {
    pantry: [],
    maxMissing: null,
    cuisine: null,
    mealTypes: []
};

const pantryList = document.getElementById("pantryList");
const ingredientInput = document.getElementById("ingredientInput");

document.getElementById("addIngredientBtn").onclick = () => {
    const value = ingredientInput.value.trim();
    if (!value || state.pantry.includes(value)) return;

    state.pantry.push(value);
    ingredientInput.value = "";
    renderPantry();
};

document.getElementById("clearPantryBtn").onclick = () => {
    state.pantry = [];
    renderPantry();
};

function renderPantry() {
    pantryList.innerHTML = "";
    state.pantry.forEach(item => {
        const el = document.createElement("div");
        el.className =
            "flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-sm border border-primary/20";
        el.innerHTML = `
            <span>${item}</span>
            <span class="material-symbols-outlined text-sm cursor-pointer">close</span>
        `;
        el.onclick = () => {
            state.pantry = state.pantry.filter(i => i !== item);
            renderPantry();
        };
        pantryList.appendChild(el);
    });
}

document.getElementById("maxMissingInput").onchange = e => {
    state.maxMissing = Number(e.target.value);
};

document.getElementById("cuisineSelect").onchange = e => {
    state.cuisine = e.target.value;
};

document.querySelectorAll(".meal-btn").forEach(btn => {
    btn.onclick = () => {
        const meal = btn.dataset.meal;
        if (state.mealTypes.includes(meal)) {
            state.mealTypes = state.mealTypes.filter(m => m !== meal);
        } else {
            state.mealTypes.push(meal);
        }
        updateMealButtons();
    };
});

function updateMealButtons() {
    document.querySelectorAll(".meal-btn").forEach(btn => {
        const meal = btn.dataset.meal;
        if (state.mealTypes.includes(meal)) {
            btn.className =
                "meal-btn px-3 py-2 rounded-lg border border-primary bg-primary/10 text-xs font-bold";
        } else {
            btn.className =
                "meal-btn px-3 py-2 rounded-lg border border-[#dbe6db] text-xs font-medium text-[#618961]";
        }
    });
}

document.getElementById("generateBtn").onclick = async () => {
    const response = await fetch("/api/search/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state)
    });

    const html = await response.text();
    document.open();
    document.write(html);
    document.close();
};
