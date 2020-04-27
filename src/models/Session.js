import * as chromeStorage from './chromeStorage';
import K from '../constants';
import { Task, FollowLoop, UnfollowLoop, Login, Logout, LikeUserPosts } from './tasks/Task';

export default class Session {
    static async createSession() {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        
        const newSession = new Session(chromeStorage.uuidv4());
        sessions.push(newSession);
        await chromeStorage.set({ sessions });
        return newSession;
    }

    static async deleteSession(sessionId) {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        const sessionIndex = sessions.findIndex(s => s.uid === sessionId);
        sessions.splice(sessionIndex, 1);
        await chromeStorage.set({ sessions });
        return sessions;
    }

    static async getAllSessions() {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        return sessions.map(Session.fromObject);
    }

    static async getSession(sessionId) {
        // @todo null error checking
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        return sessions.filter(s => {
            return s.uid === sessionId;
        }).map(Session.fromObject)[0];
    }

    static async getTask(sessionId, taskId) {
        const session = await Session.getSession(sessionId);
        const tasks = session.tasks || [];
        return tasks.filter(t => {
            return t.uid === taskId;
        }).map(Task.fromObject)[0];
    }

    static async saveTask(sessionId, taskId, newTask) {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        
        const session = sessions.filter(s => {
            return s.uid === sessionId
        })[0];

        const taskIndex = session.tasks.findIndex(t => {
            return t.uid === taskId
        });

        session.tasks[taskIndex] = newTask;

        await chromeStorage.set({ sessions });
        return newTask;
    }

    static fromObject(obj) {
        const s = new Session();
        const newS = Object.assign(s, obj);
        return newS;
    }

    constructor(uid) {
        this.uid = uid;
        this.tasks = [];
    }

    createTask = async (type) => {
        const sessionId = this.uid;
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        const session = sessions.filter(s => s.uid === sessionId)[0];
        let newTask;
        
        switch (type) {
            case K.taskType.FOLLOW_LOOP: 
                newTask = new FollowLoop(chromeStorage.uuidv4(), type);
                break;
            case K.taskType.UNFOLLOW_LOOP:
                newTask = new UnfollowLoop(chromeStorage.uuidv4(), type);
                break;
            case K.taskType.LIKE_USER_POSTS:
                newTask = new LikeUserPosts(chromeStorage.uuidv4(), type);
                break;
            case K.taskType.LOGIN:
                newTask = new Login(chromeStorage.uuidv4(), type);
                break;
            case K.taskType.LOGOUT:
                newTask = new Logout(chromeStorage.uuidv4(), type);
                break;
            default:
                throw new Error(`${type} is not a defined Task`)
        }
        session.tasks.push(newTask);

        await chromeStorage.set({ sessions })
        return newTask;
    }

    deleteTask = async (taskIndex) => {
        const sessionId = this.uid;
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        const session = sessions.filter(s => s.uid === sessionId)[0];
        const deletedTask = session.tasks.splice(taskIndex, 1)[0];

        await chromeStorage.set({ sessions });
        return deletedTask;
    }

    save = async () => {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        
        const i = sessions.findIndex(s => {
            return s.uid === this.uid;
        });

        sessions[i] = this;

        await chromeStorage.set({ sessions });
        return sessions;
    }
}