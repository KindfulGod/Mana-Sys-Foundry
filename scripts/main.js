console.log("Система маны загружена!");

// Хук на готовность Foundry
Hooks.on("ready", () => {
    console.log("Модуль успешно запущен!");

    // Добавляем поле "mana" ко всем персонажам
    Hooks.on("preCreateActor", (actor, data, options, userId) => {
        if (actor.type === "character") {
            let updates = {};
            if (!actor.system.attributes.mana) {
                updates["system.attributes.mana"] = { value: 10, max: 10 };
            }
            actor.update(updates);
        }
    });
});

// Добавляем визуальную шкалу маны в интерфейс персонажа
Hooks.on("renderActorSheet", (app, html, data) => {
    if (app.actor.type !== "character") return;

    const mana = app.actor.system.attributes.mana || { value: 0, max: 0 };
    
    // Создаём HTML-элемент для шкалы маны
    let manaBar = $(`
        <div class="mana-container">
            <label>Мана:</label>
            <div class="mana-bar">
                <div class="mana-fill" style="width: ${(mana.value / mana.max) * 100}%"></div>
            </div>
            <span>${mana.value} / ${mana.max}</span>
        </div>
    `);

    // Вставляем шкалу маны в лист персонажа
    html.find(".attributes").append(manaBar);
});