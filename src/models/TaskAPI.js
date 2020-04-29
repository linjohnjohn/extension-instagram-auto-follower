import * as chromeStorage from './chromeStorage';
import K from '../constants';
import { FollowLoop, UnfollowLoop, Login, Logout, LikeUserPosts, FollowUnfollowAlternator } from './Task';

export default class TaskAPI {
    static async createTask(type) {
        const result = await chromeStorage.get('tasks');
        const tasks = result.tasks || {};
        let newTask;

        switch (type) {
            case K.taskType.FOLLOW_LOOP:
                newTask = new FollowLoop();
                break;
            case K.taskType.UNFOLLOW_LOOP:
                newTask = new UnfollowLoop();
                break;
            case K.taskType.FOLLOW_UNFOLLOW_ALTERNATOR:
                newTask = new FollowUnfollowAlternator();
                break;
            case K.taskType.LIKE_USER_POSTS:
                newTask = new LikeUserPosts();
                break;
            case K.taskType.LOGIN:
                newTask = new Login();
                break;
            case K.taskType.LOGOUT:
                newTask = new Logout();
                break;
            default:
                throw new Error(`${type} is not a defined Task`)
        }

        const newTaskId = newTask.uid;
        tasks[newTaskId] = newTask;
        await chromeStorage.set({ tasks });
        return newTask;
    }

    static async getTask(taskId) {
        const result = await chromeStorage.get('tasks');
        const tasks = result.tasks || {};
        return tasks[taskId];
    }

    static async getMultipleTasks(taskIdArray) {
        const result = await chromeStorage.get('tasks');
        const tasks = result.tasks || [];
        return taskIdArray.map(taskId => tasks[taskId]);
    }

    static async updateTask(taskId, updatedTask) {
        const result = await chromeStorage.get('tasks');
        const tasks = result.tasks || {};

        const newTask = tasks[taskId];
        Object.assign(newTask, updatedTask);
        await chromeStorage.set({ tasks });
        return newTask;
    }

    static fromObject(obj) {
        let task;
        switch (obj.type) {
            case K.taskType.FOLLOW_LOOP:
                task = new FollowLoop();
                return Object.assign(task, obj);
            case K.taskType.UNFOLLOW_LOOP:
                task = new UnfollowLoop();
                return Object.assign(task, obj);
            case K.taskType.FOLLOW_UNFOLLOW_ALTERNATOR:
                task = new FollowUnfollowAlternator();
                return Object.assign(task, obj);
            case K.taskType.LIKE_USER_POSTS:
                task = new LikeUserPosts();
                return Object.assign(task, obj);
            case K.taskType.LOGIN:
                task = new Login();
                return Object.assign(task, obj);
            case K.taskType.LOGOUT:
                task = new Logout();
                return Object.assign(task, obj);
            default:
                throw new Error(`${obj.type} is not a defined Task`)
        }
    }
}