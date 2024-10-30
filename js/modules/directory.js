import { archivoAArrayBuffer } from "./utilities.js";


export async function getFilesPDFs(directoryInput) {
    const archivos = directoryInput.files; // Obtener todos los archivos seleccionados
    const buffersPDF = {}; // Array para almacenar los ArrayBuffer de archivos PDF válidos

    // Comprobar si no se han seleccionado archivos
    if (archivos.length === 0) {
        alert('Por favor, selecciona al menos un archivo PDF.'); 
        return []; // Retorna un array vacío si no hay archivos
    } 

    // Filtrar archivos para que solo queden los PDFs
    for (let i = 0; i < archivos.length; i++) {
        if (archivos[i].type === 'application/pdf') {
            const buffer = await archivoAArrayBuffer(archivos[i]); // Convertir a ArrayBuffer
            const nameFile = archivos[i].name.split('.').slice(0, -1).join('.');
            buffersPDF[nameFile] = buffer;
        }
    }

    return buffersPDF; // Retorna el array de archivos PDF válidos
}

// Especificar la ruta del worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

export async function getTextContentPDFDocument(arrayBuffer) {
    const pages = [];
    try {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        var totalPages = pdf.numPages;
        //console.log(`Total de páginas: ${totalPages}`);

        // Iterar sobre cada página
        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContentPage = await page.getTextContent();
            //console.log(`Página ${i}:`, page);
            pages.push({
                pageNumber: i,
                textContentPage: textContentPage // Aquí puedes añadir más propiedades si lo deseas
            });
            // Aquí puedes realizar más acciones con cada página
        }
    } catch (error) {
        console.error('Error loading PDF document:', error);
        throw error;
    }
    return {content: pages, cantPages: totalPages};
}

export function searchTextContentPDF(text, content) {
    const results = {};
    for (let i = 0; i < content.length; i++) {
        const textItems = content[i].textContentPage.items;
        for (const item of textItems) {
            let wordFound = item.str.toLowerCase().includes(text.toLowerCase());;
            if (wordFound) {
                results[i+1] = {
                    textFound: item.str,
                    posX: item.transform[4],
                    posY: item.transform[5], 
                };

            }
        }
    }
    return results;
}

export async function insertSignaturePDF(bufferPDF, pageNumber, bufferSignature, posXSignature, posYSignature, signatureWidth, signatureHeight) {
    const pdfDoc = await PDFLib.PDFDocument.load(bufferPDF); // Carga el PDF desde el ArrayBuffer
    const firmaEmbed = await pdfDoc.embedPng(bufferSignature);

    const pagina = pdfDoc.getPage(pageNumber-1);

    pagina.drawImage(firmaEmbed, {
        x: posXSignature, // Ajusta posición y tamaño
        y: posYSignature,
        width: signatureWidth,
        height: signatureHeight
    });
    //console.log()
    return await pdfDoc.save(); // Retorna el PDF modificado como ArrayBuffer
}


export async function extractImagesFromPDF(bufferPDF) {
    const images = [];
    
    // Convertir el ArrayBuffer en un Blob y crear una URL temporal
    const blob = new Blob([bufferPDF], { type: 'application/pdf' });
    const fileUrl = URL.createObjectURL(blob);

    const pdf = await pdfjsLib.getDocument(fileUrl).promise;
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        
        // Configuración del canvas para renderizar la página
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');

        // Renderizar la página en el canvas
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        // Convertir el contenido del canvas a un Blob para procesar con OCR
        const imgBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

        // Crear URL de la imagen para Tesseract
        const imgUrl = URL.createObjectURL(imgBlob);
        const imgElement = new Image();
        imgElement.src = imgUrl;

        // Espera a que la imagen esté completamente cargada
        await new Promise((resolve) => imgElement.onload = resolve);

        // Agregar la imagen a la lista de imágenes procesables
        images.push(imgElement);
    }

    return images;
}


export async function searchWordInPDFImages(images, wordToSearch) {
    const searchResults = {};

    for (const [index, imgElement] of images.entries()) {
        const { data: { words } } = await Tesseract.recognize(imgElement, 'spa');

        // Filtrar las palabras encontradas en la página para ver si coincide con la palabra buscada
        const foundWords = words.filter(word => word.text.toLowerCase() === wordToSearch.toLowerCase());

        // Si la palabra se encontró en la página, guardamos la información en searchResults
        if (foundWords.length > 0) {
            searchResults[index+1] = foundWords.map(word => ({
                x: word.bbox.x0,
                y: imgElement.height - word.bbox.y1,
            }));
        }
    }

    return searchResults;
}

export async function insertSignaturePDFImage(bufferPDF, pageNumber, bufferSignature, posXSignature, posYSignature, signatureWidth, signatureHeight) {
    // Cargar el PDF existente
    const pdfDoc = await PDFDocument.load(bufferPDF);
    
    // Embed the image (png, jpeg, etc.)
    const image = await pdfDoc.embedPng(bufferSignature); // o embedJpg(imageBuffer) si es JPG

    // Seleccionar la página donde se desea insertar la imagen
    const page = pdfDoc.getPage(pageNumber - 1); // pageNumber es 1-based, así que restamos 1

    // Dibujar la imagen en la página
    page.drawImage(image, {
        x: posXSignature,      // Posición X
        y: posYSignature,      // Posición Y
        width: signatureWidth,  // Ancho de la imagen
        height: signatureHeight // Altura de la imagen
    });

    // Guardar el PDF modificado
    const pdfBytes = await pdfDoc.save();
    return pdfBytes; // Retorna el PDF modificado como ArrayBuffer
}