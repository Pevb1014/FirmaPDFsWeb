export function getSearchText(textInput) {
    const text = textInput.value; // Obtener el texto del campo de entrada

    // Comprobar si no se ha ingresado texto
    if (text.trim() === '') {
        alert('Por favor, ingrese texto a buscar.');
        return null; // Retorna null si no hay texto ingresado
    }

    return text; // Retorna el texto ingresado
}
