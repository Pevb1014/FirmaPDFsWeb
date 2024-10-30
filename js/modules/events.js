import { getFilesPDFs, getTextContentPDFDocument, searchTextContentPDF, insertSignaturePDF, extractImagesFromPDF, searchWordInPDFImages } from "./directory.js";
import { getFileSignature } from "./signature.js";
import { getSearchText } from "./text.js";
import { getOptionPage } from "./options.js";
import { download } from "./utilities.js";

const buttonProcess = document.getElementById('process-btn');
const inputFileDirectory = document.getElementById('pdf-directory');
const inputFileSignature = document.getElementById('signature-file');
const labelSearchText = document.getElementById('search-text');
const optionPage = document.getElementById('page-search');
const signatureWidth = 120;
const signatureHeight = 60;

export async function manejoEventos() {
    buttonProcess.addEventListener('click', async function () {
        const buffersPDF = await getFilesPDFs(inputFileDirectory);
        const bufferSignature = await getFileSignature(inputFileSignature);
        const text = getSearchText(labelSearchText);
        let searchPage = getOptionPage(optionPage);

        //console.log(buffersPDF)
        let archivosNoEncontrados = [];

        if (Object.keys(buffersPDF).length !== 0 || signatureFile !== null || text !== null) {
            for (const [key, BufferPDFFile] of Object.entries(buffersPDF)) {
                const textContentPDF = await getTextContentPDFDocument(BufferPDFFile);
                searchPage = textContentPDF.cantPages - searchPage;
        
                if (textContentPDF.content[0].textContentPage.items.length > 0) {
                    console.log('Documento tipo texto');
                    const searchTextContentResult = searchTextContentPDF(text, textContentPDF.content);
                    if (searchPage in searchTextContentResult) {
                        const infoResult = searchTextContentResult[searchPage];
                        //console.log(infoResult)
                        const newBufferPDFText = await insertSignaturePDF(BufferPDFFile, searchPage, bufferSignature, infoResult.posX, infoResult.posY, signatureWidth, signatureHeight);
                        //download(newBufferPDFText, `${key} firmado.pdf`); // Agrega extensión .pdf al nombre
                        //console.log(newBufferPDF);
                    }
                } else {
                    console.log('Documento tipo imagen');
                    const images = await extractImagesFromPDF(BufferPDFFile);
                    const searchResults = await searchWordInPDFImages(images, text);
                    console.log(searchResults);
                    if (searchPage in searchResults) {
                        console.log("Si se encontro texto");
                        const keys = Object.keys(searchResults[searchPage]);
                        const lastKey = keys[keys.length - 1];
                        const lastValue = searchResults[searchPage][lastKey];
                        const newBufferPDFImage = await insertSignaturePDF(BufferPDFFile, searchPage, bufferSignature, lastValue.x, lastValue.y, signatureWidth, signatureHeight);
                        download(newBufferPDFImage, `${key} firmado.pdf`);
                        console.log(lastValue);
                    }
                }
                searchPage = 0;
            }
        }
        
    });

}
