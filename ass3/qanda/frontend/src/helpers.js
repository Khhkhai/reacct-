/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

/**
 * Get threadId from localStroage
 */
export const getThreadId = () => localStorage.getItem('threadId');

/**
 * Get userId from localStroage
 */
export const getUserId = () => localStorage.getItem('userId');

/**
 * Get token from localStroage
 */
export const getToken = () => localStorage.getItem('token');

/**
 * create error pop up
 */
export const alertFn = (message) => {
    document.getElementById("alert-message").textContent = message;
    showModal(document.getElementById("error-container"));
}

/**
 * show Modal
 */
export const showModal = (container) => {
    let modal = bootstrap.Modal.getInstance(container);
    if (!modal) modal = new bootstrap.Modal(container);
    modal.show();
};

/**
 * hide Modal
 */
export const hideModal = (container) => {
    const modal = bootstrap.Modal.getInstance(container);
    if (modal) modal.hide();
};

export const requireOnline = () => {
    if (!navigator.onLine) {
        alertFn("You are offline.");
        return false;
    }
    return true;
};