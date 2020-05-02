import * as chromeStorage from './chromeStorage';
import Session from './Session';
import TaskAPI from './TaskAPI';

export default class SessionAPI {

    static async createSession(name = 'No Name') {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        const newSession = new Session(name);
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

    static async getAllSessions(populate = false) {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        if (populate) {
            for (const session of sessions) {
                session.tasks = await TaskAPI.getMultipleTasks(session.tasks);
            }
        }
        return sessions.map(SessionAPI.fromObject);
    }

    static async getSession(sessionId, populate = false) {
        // @todo null error checking
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        const session = sessions.filter(s => {
            return s.uid === sessionId;
        }).map(SessionAPI.fromObject)[0];
        if (populate) {
            session.tasks = await TaskAPI.getMultipleTasks(session.tasks);
        }
        return session;
    }

    static async updateSession(sessionId, updatedSession) {
        const result = await chromeStorage.get('sessions');
        const sessions = result.sessions || [];
        const sIndex = sessions.findIndex(s => {
            return s.uid === sessionId;
        });
        const session = sessions[sIndex];
        Object.assign(session, updatedSession);
        console.log('ses', updatedSession)
        console.log('ses', session)
        await chromeStorage.set({ sessions });
        return updatedSession;
    }
    
    static async reorderSession(newOrder) {
        const sessions = await SessionAPI.getAllSessions();
        const sessionMap = sessions.reduce((sessionMap, s) => {
            sessionMap[s.uid] = s;
            return sessionMap;
        }, {});
        const newSessionIdsAllExists = newOrder.reduce((prev, id) => {
            return prev && sessionMap[id];
        }, true);
        if (sessions.length === newOrder.length && newSessionIdsAllExists) {
            const newSessions = newOrder.map(id => sessionMap[id]);
            await chromeStorage.set({ sessions: newSessions });
        } else {
            throw new Error('New session ids do not match with existing session ids');
        }
    }

    static fromObject(obj) {
        const s = new Session();
        const newS = Object.assign(s, obj);
        return newS;
    }

    static async addTask(sessionId, type) {
        const session = await SessionAPI.getSession(sessionId);
        const newTask = await TaskAPI.createTask(type);
        const newTaskId = newTask.uid;
        session.tasks.push(newTaskId);
        await SessionAPI.updateSession(sessionId, session)
        return newTask;
    }

    static async deleteTask(sessionId, taskId) {
        const session = await SessionAPI.getSession(sessionId);
        const result = await chromeStorage.get('tasks');
        const tasks = result.tasks || {};
        session.tasks = session.tasks.filter(t => t !== taskId);
        delete tasks[taskId];
        // @todo error handle when task is not part of session
        await SessionAPI.updateSession(sessionId, session);
        await chromeStorage.set({ tasks });
        return taskId;
    }
}