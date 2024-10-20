export function getFileSignature() {
    const inputFileSignature = document.getElementById('signature-file');
    const signature = inputFileSignature.files[0]; // Obtener el archivo de la firma

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

    return signature; // Retorna el archivo de la firma si es válido
}

