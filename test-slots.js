const slotsParam = "%5B%7B%22date%22%3A%222026-02-12%22%2C%22time%22%3A%228%3A00am%22%7D%5D";

try {
    const parsedSlots = JSON.parse(decodeURIComponent(slotsParam));
    console.log("Parsed Slots:", parsedSlots);

    const availableSlots = [
        { label: "8:00 AM", isBooked: false },
        { label: "9:00 AM", isBooked: false }
    ];

    const pendingSlots = parsedSlots;
    const matchedSlots = [];

    pendingSlots.forEach(pSlot => {
        const pTimeLower = pSlot.time.toLowerCase().replace(/\s/g, ''); // "8:00am"
        console.log(`Matching slot: ${pSlot.time} (lower: ${pTimeLower})`);

        const match = availableSlots.find(slot => {
            const slotLabelLower = slot.label.toLowerCase().replace(/\s/g, ''); // "8:00am"
            console.log(`  Comparing with: ${slot.label} (lower: ${slotLabelLower})`);
            return slotLabelLower === pTimeLower && !slot.isBooked;
        });

        if (match) {
            console.log("  Match found:", match);
            matchedSlots.push(match);
        } else {
            console.log("  No match found");
        }
    });

} catch (e) {
    console.error(e);
}
