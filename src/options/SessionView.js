import React from 'react';

import K from '../constants';
import { Link } from 'react-router-dom';
import SessionAPI from '../models/SessionAPI';
import Dnd from './dnd';
import TaskAPI from '../models/TaskAPI';

export default class extends React.Component {
    state = {
        session: {},
        taskMap: {},
        newTaskType: 'none',
        newName: ''
    }

    dnd = null;

    componentDidMount = async () => {
        const { sessionId } = this.props.match.params;
        // @todo error checking
        const session = await SessionAPI.getSession(sessionId);
        const relevantTasks = await TaskAPI.getMultipleTasks(session.tasks);
        const taskMap = relevantTasks.reduce((taskMap, task) => {
            taskMap[task.uid] = task;
            return taskMap
        }, {});
        this.setState({ session, taskMap });
        const parent = document.querySelector('#taskList');
        const children = parent.querySelectorAll('li')
        const dnd = new Dnd(parent, this.handleNewTaskOrder, this.handleSaveNewOrder);
        dnd.reinitializeChildren(children, session.tasks);
        this.dnd = dnd;
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.session !== prevState.session) {
            const parent = document.querySelector('#taskList');
            const children = parent.querySelectorAll('li');
            this.dnd && this.dnd.reinitializeChildren(children, this.state.session.tasks);
        }
    }

    handleToggleEdit = () => {
        const { session } = this.state;
        const { name = '' } = session;
        this.setState({ isEditing: true, newName: name });
    }

    handleSaveEdit = async () => {
        const { session, newName } = this.state;
        const newSession = { ...session, name: newName };
        await SessionAPI.updateSession(newSession.uid, newSession);
        this.setState({ isEditing: false, session: newSession });
    }

    handleCancelEdit = () => {
        this.setState({ isEditing: false });
    }

    handleNewTaskOrder = (newTaskOrder) => {
        const newSession = { ...this.state.session };
        newSession.tasks = newTaskOrder;
        this.setState({ session: newSession });
    }

    handleSaveNewOrder = async (newTaskOrder) => {
        const newSession = { ...this.state.session };
        newSession.tasks = newTaskOrder;
        const updatedSession = await SessionAPI.updateSession(newSession.uid, newSession);
        this.setState({ session: updatedSession });
    }

    handleAddTask = async () => {
        const { session, taskMap, newTaskType } = this.state;
        if (session && newTaskType !== 'none') {
            const newTask = await SessionAPI.addTask(session.uid, newTaskType);
            session.tasks.push(newTask.uid);
            const newTaskMap = { ...taskMap, [newTask.uid]: newTask };
            this.setState({ session: { ...session }, taskMap: newTaskMap });
        }
    }

    handleDeleteTask = async (taskIndex) => {
        const { session } = this.state;
        const taskId = session.tasks[taskIndex];
        await SessionAPI.deleteTask(session.uid, taskId);
        session.tasks.splice(taskIndex, 1);
        this.setState({ session: { ...session } });
    }

    render() {
        const { session, newTaskType, taskMap, isEditing, newName } = this.state;
        const { tasks = [] } = session;
        const taskTypes = Object.values(K.taskType);

        return <>
            <div class='mb-3'>
                <div className="form-group row">
                    <h3 className='col-sm-4'><b>Session: </b></h3>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input class="form-control" value={newName} onChange={e => this.setState({ newName: e.target.value })} /> :
                            <h3>{session.name || 'No Name'}</h3>
                        }
                    </div>
                </div>

                {isEditing ?
                    <React.Fragment>
                        <button class='btn btn-success btn-block' onClick={this.handleSaveEdit}>Save Changes</button>
                        <button class='btn btn-danger btn-block' onClick={this.handleCancelEdit}>Cancel</button>
                    </React.Fragment> :
                    <button class='btn btn-danger btn-block' onClick={this.handleToggleEdit}>Edit</button>
                }
            </div>

            <h4>Add A Task</h4>

            <form className='mb-3'>
                <div className="form-group">
                    <label>Task Type</label>
                    <select
                        className="custom-select"
                        value={newTaskType}
                        onChange={(e) => {
                            this.setState({ newTaskType: e.target.value });
                        }}>
                        <option value="none" selected disabled hidden>Select A New Task Type</option>
                        {taskTypes.map((task) => {
                            return <option value={task}>{task}</option>
                        })}
                    </select>
                </div>
                <button
                    type="button"
                    class="btn btn-primary"
                    onClick={this.handleAddTask}>
                    Add Task
                        </button>
            </form>

            <h4>Existing Tasks</h4>

            <div class="list-group" id='taskList'>

                {tasks.map((taskId, i) => {
                    return <li class='list-group-item list-group-item-action d-flex flex-row justify-content-between' key={taskId} data-dnd-id={taskId}>
                        <div>
                            <svg viewBox="0 0 100 100" height="16" width="16">
                                <rect width="100" height="20" rx="8"></rect>
                                <rect y="30" width="100" height="20" rx="8"></rect>
                                <rect y="60" width="100" height="20" rx="8"></rect>
                            </svg>&nbsp;
                                    <Link to={`/session/${session.uid}/task/${taskId}`} class='text-dark' draggable={false}>
                                {taskMap[taskId].type}
                            </Link>
                        </div>
                        <a href='# ' class='text-danger' onClick={() => this.handleDeleteTask(i)} draggable={false}>Delete</a>
                    </li>
                })}
            </div>
        </>
    }
}