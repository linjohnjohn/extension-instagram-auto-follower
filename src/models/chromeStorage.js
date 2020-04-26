/* global chrome */

export const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const get = (...args) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(args, (result) => {
            resolve(result);
        });
    });
}

export const set = (data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(data, () => {
            resolve(data);
        });
    });
}