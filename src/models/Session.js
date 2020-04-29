import * as chromeStorage from './chromeStorage';

export default class Session {
    constructor() {
        this.uid = chromeStorage.uuidv4();
        this.tasks = [];
    }
}