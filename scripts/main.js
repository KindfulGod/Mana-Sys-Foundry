console.log("Система маны загружена!");

// Хук на готовность Foundry
Hooks.on("ready", () => {
    console.log("Модуль успешно запущен!");
});

// Добавляем поле "mana" ко всем новым персонажам
Hooks.on("preCreateActor", async (actor, data, options, userId) => {
    if (actor.type === "character") {
        let updates = {};
        // Исправляем getProperty на правильный метод
        if (!foundry.utils.getProperty(data, "system.attributes.mana")) {
            updates["system.attributes.mana"] = { value: 10, max: 10 };
        }
        if (Object.keys(updates).length > 0) {
            // Обновляем актера перед его созданием
            await actor.update(updates);
        }
    }
});

// Добавляем визуальную шкалу маны в интерфейс персонажа
Hooks.on("renderActorSheet", async (app, html, data) => {
    if (app.actor.type !== "character") return;

    // Проверяем, есть ли у персонажа мана
    if (!app.actor.system.attributes.mana) {
        // Обновляем данные персонажа с указанием _id
        await app.actor.update({
            "_id": app.actor.id,  // Указываем _id актера
            "system.attributes.mana": { value: 10, max: 10 }
        });
    }

    const mana = app.actor.system.attributes.mana || { value: 0, max: 0 };

    // Создаём HTML-элемент для шкалы маны
    let manaBar = $(`
        <div class="mana-container">
            <label>Мана:</label>
            <div class="mana-bar">
                <div class="mana-fill" style="width: ${(mana.value / mana.max) * 100}%;"></div>
            </div>
            <span>${mana.value} / ${mana.max}</span>
        </div>
    `);

    // Вставляем шкалу маны в лист персонажа
    html.find(".attributes").append(manaBar);
});