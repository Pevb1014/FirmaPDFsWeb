import { archivoAArrayBuffer } from "./utilities.js";

export async function getFileSignature(signatureInput) {
    const signature = signatureInput.files[0]; // Obtener el archivo de la firma

    // Comprobar si no se ha seleccionado ningún archivo
    if (!signature) {
        alert('Por favor, selecciona una firma.');
        return null; // Retorna null si no hay archivo seleccionado
    }

    // Comprobar si el archivo es un PNG
    if (signature.type !== 'image/png') {
        alert('Por favor, selecciona un archivo .png válido.');
        return null; // Retorna null si el archivo no es un PNG
    }

    // Convertir la firma a ArrayBuffer
    const buffer = await archivoAArrayBuffer(signature);
    return buffer; // Retorna el ArrayBuffer del archivo de la firma
}

