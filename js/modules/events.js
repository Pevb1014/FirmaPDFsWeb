import { getFilesPDFs } from "./directory.js";
import { getFileSignature } from "./signature.js";
import { getSearchText } from "./text.js";

export function manejoEventos() {
    const buttonProcess = document.getElementById('process-btn');
    buttonProcess.addEventListener('click', function () {
        const pdfs = getFilesPDFs();
        const signature = getFileSignature();
        const text = getSearchText();
        if (pdfs.length > 0 || signature !== null || text !== null) {
            alert("Ejecucion manejoEventos desde el main");
        }
    });

}
