const slotsParam = "%5B%7B%22date%22%3A%222026-02-12%22%2C%22time%22%3A%228%3A00am%22%7D%5D";

// Mock state
let pendingSlots = null;
let availableSlots = [];
let selectedSlots = [];

// 1. Parse Param
try {
    const parsedSlots = JSON.parse(decodeURIComponent(slotsParam));
    console.log("1. Parsed Slots from URL:", parsedSlots);
    if (Array.isArray(parsedSlots) && parsedSlots.length > 0) {
        pendingSlots = parsedSlots;
        console.log("   -> Set pendingSlots");
    }
} catch (e) {
    console.error(e);
}

// 2. Simulate API Load (Async)
console.log("2. Loading slots from API...");
setTimeout(() => {
    availableSlots = [
        { label: "8:00 AM", isBooked: false, id: 1 },
        { label: "9:00 AM", isBooked: false, id: 2 },
        { label: "10:00 AM", isBooked: true, id: 3 }
    ];
    console.log("   -> API Loaded. availableSlots:", availableSlots);

    // 3. Trigger Effect (Dependency: availableSlots, pendingSlots)
    checkPendingSlots();
}, 100);

// Effect Logic
function checkPendingSlots() {
    console.log("3. Effect Triggered.");
    console.log(`   pendingSlots:`, pendingSlots);
    console.log(`   availableSlots length: ${availableSlots.length}`);

    if (pendingSlots && availableSlots.length > 0) {
        const matchedSlots = [];

        pendingSlots.forEach(pSlot => {
            const pTimeLower = pSlot.time.toLowerCase().replace(/\s/g, ''); // "8:00am"

            const match = availableSlots.find(slot => {
                const slotLabelLower = slot.label.toLowerCase().replace(/\s/g, ''); // "8:00am"
                return slotLabelLower === pTimeLower && !slot.isBooked;
            });

            if (match) {
                console.log(`   -> Match found for ${pSlot.time}:`, match);
                matchedSlots.push(match);
            } else {
                console.log(`   -> No match found for ${pSlot.time}`);
            }
        });

        if (matchedSlots.length > 0) {
            selectedSlots = matchedSlots;
            console.log("   -> Updated selectedSlots:", selectedSlots);
            console.log("   -> SHOW CONFIRMATION TRUE");
        } else {
            console.log("   -> No valid slots matched.");
        }

        pendingSlots = null; // Clear pending
        console.log("   -> Cleared pendingSlots");
    } else {
        console.log("   -> Condition failed (no pending slots or no available slots)");
    }
}
