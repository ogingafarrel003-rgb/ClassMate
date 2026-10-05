// ClassMate AI development service
// This version does not use a paid AI API.

async function askClassMateAI({
    question,
    grade,
    subject,
}) {
    if (!question || String(question).trim() === "") {
        throw new Error("Question is required");
    }

    const cleanQuestion = String(question).trim();
    const lowerQuestion = cleanQuestion.toLowerCase();

    let answer;

    if (
        lowerQuestion.includes("2 + 3") ||
        lowerQuestion.includes("2+3")
    ) {
        answer =
            "2 + 3 = 5. Start with 2 and count 3 more: 3, 4, 5.";
    } else if (
        lowerQuestion.includes("5 + 5") ||
        lowerQuestion.includes("5+5")
    ) {
        answer =
            "5 + 5 = 10. Add the two numbers together to get 10.";
    } else {
        answer =
            "ClassMate AI is currently in development mode. " +
            "Your question has been received successfully. " +
            "A live AI provider will be connected later to provide a detailed answer.";
    }

    return {
        answer,
        mode: "development",
        question: cleanQuestion,
        grade: grade || null,
        subject: subject || null,
    };
}

module.exports = {
    askClassMateAI,
};