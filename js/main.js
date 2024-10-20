import { manejoEventos } from "./modules/events.js";

manejoEventos();
/*
var inputFileDirectory = document.getElementById('pdf-directory');
var inputFileSignature = document.getElementById('signature-file');
var labelSearchText = document.getElementById('search-text');
var optionPage = document.getElementById('page-search');
var buttonProcess = document.getElementById('process-btn');
var containerResult = document.getElementById('result');
var canvas = document.getElementById('pdf-canvas');

buttonProcess.addEventListener('click', async function () {
    const archivos = inputFileDirectory.files;
    var pageSearch = optionPage.value;
    const optionsPage = optionPage.options;
    console.log(pageSearch == optionsPage[0].text);

    if (archivos.length === 0) {
        alert('Por favor, selecciona al menos un archivo PDF.');
        return;
    }
    if (!inputFileSignature.files[0]) {
        alert('Por favor, selecciona una firma.');
        return;
    }
    if (labelSearchText.value === '') {
        alert('Por favor, ingrese la palabra a buscar');
        return;
    }

    const imageFile = inputFileSignature.files[0];
    const imageDataUrl = await readFileAsDataUrl(imageFile);
    const imageBytes = await fetch(imageDataUrl).then(res => res.arrayBuffer());

    // Limpiar resultados previos
    containerResult.innerHTML = '';

    for (let i = 0; i < archivos.length; i++) {
        if (archivos[i].type === 'application/pdf') {
            const fileReader = new FileReader();
            const archivo = archivos[i];

            fileReader.onload = async function (event) {
                const arrayBuffer = event.target.result;

                // Cargar el PDF usando pdf.js
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                loadingTask.promise.then(async function (pdf) {
                    const numPages = pdf.numPages;
                    console.log('Número de páginas:', numPages);

                    // Obtener la página donde buscar el texto
                    if (pageSearch == optionsPage[0].text) {
                        var page = await pdf.getPage(numPages);
                        console.log('Página', numPages);
                    } else if (pageSearch == optionsPage[1].text) {
                        var page = await pdf.getPage(numPages - 1);
                        console.log('Página', numPages - 1);
                    } else {
                        var page = await pdf.getPage(numPages - 2);
                        console.log('Página', numPages - 2);
                    }
                    console.log('Página cargada');

                    // Extraer texto de la página
                    const textContent = await page.getTextContent();
                    const searchWord = labelSearchText.value;
                    const results = []; // Para almacenar resultados con coordenadas

                    var scale = 1.5;
                    var rotation = page.rotate;  // Obtener la rotación de la página
                    var viewport = page.getViewport({ scale: scale, rotation: rotation });
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext).promise.then(function () {
                        // Después de renderizar, extraer la imagen del canvas
                        var imgData = canvas.toDataURL("image/png");

                        // Usar Tesseract.js para realizar OCR en la imagen extraída
                        Tesseract.recognize(
                            imgData,
                            'spa',  // Idioma de OCR
                            {
                                logger: m => console.log(m)  // Monitorear el progreso
                            }
                        ).then(({ data: { text } }) => {
                            console.log("Texto extraído:", text);
                        }).catch(err => {
                            console.error("Error con Tesseract:", err);
                        });
                    });


                    // Recorrer elementos de texto para buscar la palabra
                    for (const item of textContent.items) {
                        let index = item.str.indexOf(searchWord);
                        if (index !== -1) {
                            // Guardar información de la palabra encontrada
                            results.push({
                                text: item.str,
                                x: item.transform[4], // Coordenada x
                                y: item.transform[5], // Coordenada y
                            });

                        }
                    }

                    // Modificar el PDF usando pdf-lib
                    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                    const pageLib = pdfDoc.getPages()[numPages - 1]; // Última página

                    // Agregar la imagen
                    if (results.length > 0) {
                        const signatureWidth = 120;
                        const signatureHeight = 60;
                        for (const result of results) {
                            const image = await pdfDoc.embedPng(imageBytes); // Esperar a que se embeda la imagen

                            // Depuración
                            console.log('Nombre pdf:', archivo.name);

                            console.log(`Palabra encontrada en: X=${result.x}, Y=${result.y}`);
                            console.log(`Colocando imagen en: X=${result.x}, Y=${result.y}, Altura de la página=${pageLib.getHeight()}`);
                            // Colocar la imagen en las coordenadas encontradas
                            pageLib.drawImage(image, {
                                x: result.x,
                                y: result.y, // Invertir Y para la posición correcta
                                width: signatureWidth,
                                height: signatureHeight,
                            });
                        }

                        // Guardar el nuevo PDF
                        const pdfBytes = await pdfDoc.save();
                        download(pdfBytes, `resultado_${archivo.name}`);
                        containerResult.innerHTML += `<label>Archivo: ${archivo.name} - Imagen agregada en las coordenadas de la palabra "${searchWord}".</label><br>`;
                    } else {
                        containerResult.innerHTML += `<label>Archivo: ${archivo.name} - La palabra "${searchWord}" NO se encontró en la última página.</label><br>`;
                    }
                }, function (reason) {
                    console.error('Error al cargar el PDF:', reason);
                    const errorLabel = document.createElement('label');
                    errorLabel.textContent = `Error al cargar el archivo: ${archivo.name}`;
                    containerResult.appendChild(errorLabel);
                    containerResult.appendChild(document.createElement('br'));
                });
            };

            // Leer el archivo como ArrayBuffer
            fileReader.readAsArrayBuffer(archivo);
        }
    }
});

// Función para leer un archivo como Data URL
function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

// Función para descargar el PDF resultante
function download(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Limpiar la URL creada
}
    */