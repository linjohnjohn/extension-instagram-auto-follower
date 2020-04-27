import React from 'react';
import Session from '../models/Session';
import K from '../constants';
import { Link } from 'react-router-dom';

export default class extends React.Component {
    state = {
        session: {},
        newTaskType: 'none'
    }

    componentDidMount = async () => {
        const { sessionId } = this.props.match.params;
        // @todo error checking
        const session = await Session.getSession(sessionId);
        console.log(session);
        this.setState({ session });
    }

    handleAddTask = async () => {
        const { session, newTaskType } = this.state;
        if (session && newTaskType !== 'none') {
            const newTask = await session.createTask(newTaskType);
            session.tasks.push(newTask);
            this.setState({ session: { ...session } });
        }
    }

    handleDeleteTask = async (taskIndex) => {
        const { session } = this.state;
        await this.state.session.deleteTask(taskIndex);
        session.tasks.splice(taskIndex, 1);
        this.setState({ session: { ...session } });
    }

    render() {
        const { session, newTaskType } = this.state;
        const { tasks = [] } = session;
        const taskTypes = Object.values(K.taskType);

        return <div className="container">
            <div class='row justify-content-center'>
                <div class='col-6'>
                    <h1>{session.uid}</h1>

                    <h1>Tasks</h1>

                    <form>
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

                    <div class="list-group">

                        {tasks.map((task, i) => {
                            return <li class='list-group-item list-group-item-action d-flex flex-row justify-content-between'>
                            <Link to={`/session/${session.uid}/task/${task.uid}`} class='text-dark'>
                                {task.uid}
                            </Link>
                            <a href='# ' class='text-danger' onClick={() => this.handleDeleteTask(i)}>Delete</a>
                            </li>
                        })}
                    </div>
                </div>
            </div>
        </div>
    }
}