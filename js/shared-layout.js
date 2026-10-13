document.addEventListener("DOMContentLoaded", async () => {
    const script = document.querySelector(
        'script[src*="shared-layout.js"]'
    );

    if (!script) {
        console.error("shared-layout.js was not found.");
        return;
    }

    const baseURL = new URL(".", script.src);

    const slots = document.querySelectorAll("[data-include]");

    await Promise.all(
        Array.from(slots).map(async (slot) => {
            const name = slot.dataset.include;

            if (!["header", "footer"].includes(name)) return;

            try {
                const response = await fetch(
                    new URL(`../partials/${name}.html`, baseURL)
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                slot.outerHTML = await response.text();
            } catch (error) {
                console.error(`Could not load ${name}:`, error);
            }
        })
    );

    document.dispatchEvent(new Event("shared-layout-ready"));
});