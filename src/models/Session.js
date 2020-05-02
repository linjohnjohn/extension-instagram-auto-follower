import * as chromeStorage from './chromeStorage';

export default class Session {
    constructor(name) {
        this.uid = chromeStorage.uuidv4();
        this.name = name;
        this.tasks = [];
    }
}