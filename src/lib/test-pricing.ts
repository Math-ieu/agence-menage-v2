import { calculateSurchargeMultiplier } from "./pricing";

const testCases = [
    {
        name: "Monday 10:00 AM (Fixed)",
        date: "2026-02-16",
        type: "fixed",
        fixed: "10:00",
        flexible: "morning",
        expected: 1
    },
    {
        name: "Monday 6:00 PM (Fixed)",
        date: "2026-02-16",
        type: "fixed",
        fixed: "18:00",
        flexible: "morning",
        expected: 1.5
    },
    {
        name: "Sunday 10:00 AM (Fixed)",
        date: "2026-02-15",
        type: "fixed",
        fixed: "10:00",
        flexible: "morning",
        expected: 1.25
    },
    {
        name: "Sunday 6:00 PM (Fixed)",
        date: "2026-02-15",
        type: "fixed",
        fixed: "18:00",
        flexible: "morning",
        expected: 1.5
    },
    {
        name: "Monday (Flexible - morning)",
        date: "2026-02-16",
        type: "flexible",
        fixed: "14:00",
        flexible: "morning",
        expected: 1
    },
    {
        name: "Sunday (Flexible - afternoon)",
        date: "2026-02-15",
        type: "flexible",
        fixed: "14:00",
        flexible: "afternoon",
        expected: 1.25
    }
];

console.log("Running Pricing Surcharge Tests...\n");

let passed = 0;
testCases.forEach(tc => {
    const result = calculateSurchargeMultiplier(tc.date, tc.type, tc.fixed, tc.flexible);
    if (result === tc.expected) {
        console.log(`✅ ${tc.name}: PASSED (Result: ${result})`);
        passed++;
    } else {
        console.log(`❌ ${tc.name}: FAILED (Expected: ${tc.expected}, Got: ${result})`);
    }
});

console.log(`\nSummary: ${passed}/${testCases.length} tests passed.`);
if (passed === testCases.length) {
    process.exit(0);
} else {
    process.exit(1);
}
