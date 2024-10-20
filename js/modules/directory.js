export function getFilesPDFs() {
    const inputFileDirectory = document.getElementById('pdf-directory');
    const archivos = inputFileDirectory.files; // Obtener todos los archivos seleccionados
    const archivosPDF = []; // Array para almacenar solo archivos PDF válidos

    // Comprobar si no se han seleccionado archivos
    if (archivos.length === 0) {
        alert('Por favor, selecciona al menos un archivo PDF.'); 
        return []; // Retorna un array vacío si no hay archivos
    } 

    // Filtrar archivos para que solo queden los PDFs
    for (let i = 0; i < archivos.length; i++) {
        if (archivos[i].type === 'application/pdf') {
            archivosPDF.push(archivos[i]); // Agrega solo archivos PDF al array
        }
    }

    return archivosPDF; // Retorna el array de archivos PDF válidos
}
