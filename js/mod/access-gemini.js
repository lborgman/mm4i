// @ts-check
const ACCESS_GEMINI_VER = "0.0.1";
window["logConsoleHereIs"](`here is access-gemini.js, module, ${ACCESS_GEMINI_VER}`);
if (document.currentScript) { throw "access-gemini.js is not loaded as module"; }

// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const modApp = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js");
const modAi = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-ai.js");
// import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyANd3vgrDROcCw4ZdZ2_xCXwcfGd8ZWH_o",
    authDomain: "accessgemini-830df.firebaseapp.com",
    projectId: "accessgemini-830df",
    storageBucket: "accessgemini-830df.firebasestorage.app",
    messagingSenderId: "836879860847",
    appId: "1:836879860847:web:d73903e879266f7cb1f99a"
};

// Initialize Firebase
const firebaseApp = modApp.initializeApp(firebaseConfig);

// Initialize the Gemini Developer API backend service
const ai = modAi.getAI(firebaseApp, { backend: new modAi.GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const model = modAi.getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export async function ask(prompt) {
    // Provide a prompt that contains text
    // const prompt = "Write a story about a magic backpack."
    // To generate text output, call generateContent with the text input
    let text = "(no result)";
    const result = { text };
    try {
        const generated = await model.generateContent(prompt);
        const response = generated.response;
        const text = response.text();
        result.text = text;
        console.log(text);
    } catch (err) {
        result.error = err;
    }
    return result;
}
// debugger;
const prompt = "Are you ok?"
const answer = await ask(prompt);
console.log("Answer:", answer);

export function apiError() {
    return answer.error;
}