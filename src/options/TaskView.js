import React from 'react';
import K from '../constants';
import Session from '../models/Session';

export default class extends React.Component {
    state = {
        task: {}
    }

    componentDidMount = async () => {
        const { sessionId, taskId } = this.props.match.params;
        const task = await Session.getTask(sessionId, taskId);
        console.log(task);
        this.setState({ task });
    }

    handleSaveEdit = async (updatedTask) => {
        const { sessionId, taskId } = this.props.match.params;
        const task = await Session.saveTask(sessionId, taskId, updatedTask);
        this.setState({ task })
    }

    renderTask(task) {
        switch (task.type) {
            case K.taskType.FOLLOW_LOOP:
                return <FollowLoopView handleSaveEdit={this.handleSaveEdit} task={task} />
            case K.taskType.UNFOLLOW_LOOP:
                return <UnfollowLoopView handleSaveEdit={this.handleSaveEdit} task={task} />
            case K.taskType.LOGIN:
                return <LoginView handleSaveEdit={this.handleSaveEdit} task={task} />
            case K.taskType.LOGOUT:
                return <LogoutView handleSaveEdit={this.handleSaveEdit} task={task} />
            case K.taskType.LIKE_USER_POSTS:
                return <LikeUserPostsView handleSaveEdit={this.handleSaveEdit} task={task} />
            default:
        }
    }

    render() {
        const { task } = this.state;

        return <div className="container">
            <div class='row justify-content-center'>
                <div class='col-6'>
                    {this.renderTask(task)}
                </div>
            </div>
        </div>
    }
}


class LoginView extends React.Component {
    state = {
        isEditing: false,
        newUsername: '',
        newPassword: ''
    }
    
    handleToggleEdit = () => {
        const { task } = this.props;
        const { username, password } = task;
        this.setState({ isEditing: true, newUsername: username, newPassword: password });
    }
    
    handleSaveEdit = () => {
        const { task } = this.props;
        const { newPassword, newUsername } = this.state;
        const newTask = { ...task, username: newUsername, password: newPassword };
        this.props.handleSaveEdit(newTask);
        this.setState({ isEditing: false });
    }
    
    handleCancelEdit = () => {
        this.setState({ isEditing: false });
    }
    
    render() {
        const { task } = this.props;
        const { username, password } = task;
        const { uid, type } = task;
        const { isEditing, newPassword, newUsername } = this.state;
        
        return <div>
            <h1>{uid}</h1>
            <div>
                <div className="form-group row">
                    <label class="col-sm-4"><b>Type:</b></label>
                    <label class="col-sm-8">{type}</label>
                </div>

                <div className="form-group row">
                    <label class="col-sm-4"><b>Username:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input class="form-control" value={newUsername} onChange={e => this.setState({ newUsername: e.target.value })} /> :
                            <label>{username}</label>
                        }
                    </div>
                </div>

                <div className="form-group row">
                    <label class="col-sm-4"><b>Password:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input class="form-control" value={newPassword} onChange={e => this.setState({ newPassword: e.target.value })} /> :
                            <label>{password}</label>
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
        </div>
    }
}

class LogoutView extends React.Component {
    render() {
        const { task } = this.props;
        const { uid, type } = task;

        return <div>
            <h1>{uid}</h1>
            <div class="row">
                <label class="col-sm-4"><b>Type:</b></label>
                <label class="col-sm-8">{type}</label>


            </div>
        </div>
    }
}

class LikeUserPostsView extends React.Component {
    state = {
        isEditing: false,
        newLikeCount: 0
    }

    handleToggleEdit = () => {
        const { task } = this.props;
        const { likeCount } = task;
        this.setState({ isEditing: true, newLikeCount: likeCount });
    }

    handleSaveEdit = () => {
        const { task } = this.props;
        const { newLikeCount } = this.state;
        const newTask = { ...task, likeCount: newLikeCount };
        this.props.handleSaveEdit(newTask);
        this.setState({ isEditing: false });
    }

    handleCancelEdit = () => {
        this.setState({ isEditing: false });
    }

    render() {
        const { task } = this.props;
        const { uid, type, likeCount } = task;
        const { isEditing, newLikeCount } = this.state;

        return <div>
            <h1>{uid}</h1>
            <div>
                <div className="form-group row">
                    <label class="col-sm-4"><b>Type:</b></label>
                    <label class="col-sm-8">{type}</label>
                </div>
                <div className="form-group row">
                    <label class="col-sm-4"><b>Like Count:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input type="number" class="form-control" value={newLikeCount} onChange={e => this.setState({ newLikeCount: e.target.value })} /> :
                            <label>{likeCount}</label>
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
        </div>
    }
}

class FollowLoopView extends React.Component {
    state = {
        isEditing: false,
        newAverageDelay: 0,
        newLimit: 0,
        newSources: ''
    }

    handleToggleEdit = () => {
        const { task } = this.props;
        const { averageDelay, limit, sources } = task;
        this.setState({ isEditing: true, newAverageDelay: averageDelay, newLimit: limit, newSources: sources.join('\n') });
    }

    handleSaveEdit = () => {
        const { task } = this.props;
        const { newAverageDelay, newLimit, newSources } = this.state;
        const newTask = { ...task, averageDelay: newAverageDelay, limit: newLimit, sources: newSources.split('\n') };
        this.props.handleSaveEdit(newTask);
        this.setState({ isEditing: false });
    }

    handleCancelEdit = () => {
        this.setState({ isEditing: false });
    }

    render() {
        const { task } = this.props;
        let { uid, type, averageDelay, limit, sources } = task;
        sources = sources.join('\n');
        const { isEditing, newAverageDelay, newLimit, newSources } = this.state;

        return <div>
            <h1>{uid}</h1>
            <div>
                <div className="form-group row">
                    <label class="col-sm-4"><b>Type:</b></label>
                    <label class="col-sm-8">{type}</label>
                </div>

                <div className="form-group row">
                    <label class="col-sm-4"><b>Average Delay:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input type="number" class="form-control" value={newAverageDelay} onChange={e => this.setState({ newAverageDelay: e.target.value })} /> :
                            <label>{averageDelay}</label>
                        }
                    </div>
                </div>

                <div className="form-group row">
                    <label class="col-sm-4"><b>Limit:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input type="number" class="form-control" value={newLimit} onChange={e => this.setState({ newLimit: e.target.value })} /> :
                            <label>{limit}</label>
                        }
                    </div>
                </div>

                <div className="form-group row">
                    <label class="col-sm-4"><b>Sources:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <textarea type="number" class="form-control" value={newSources} onChange={e => this.setState({ newSources: e.target.value })} /> :
                            <label>{sources}</label>
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
        </div>
    }
}


class UnfollowLoopView extends React.Component {
    state = {
        isEditing: false,
        newAverageDelay: 0,
        newLimit: 0
    }

    handleToggleEdit = () => {
        const { task } = this.props;
        const { averageDelay, limit } = task;
        this.setState({ isEditing: true, newAverageDelay: averageDelay, newLimit: limit });
    }

    handleSaveEdit = () => {
        const { task } = this.props;
        const { newAverageDelay, newLimit } = this.state;
        const newTask = { ...task, averageDelay: newAverageDelay, limit: newLimit };
        this.props.handleSaveEdit(newTask);
        this.setState({ isEditing: false });
    }

    handleCancelEdit = () => {
        this.setState({ isEditing: false });
    }

    render() {
        const { task } = this.props;
        const { uid, type, averageDelay, limit } = task;
        const { isEditing, newAverageDelay, newLimit } = this.state;
        return <div>
            <h1>{uid}</h1>
            <div>
                <div class="form-group row">
                    <label class="col-sm-4"><b>Type:</b></label>
                    <label class="col-sm-8">{type}</label>
                </div>

                <div class="form-group row">
                    <label class="col-sm-4"><b>Average Delay:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input type="number" class="form-control" value={newAverageDelay} onChange={e => this.setState({ newAverageDelay: e.target.value })} /> :
                            <label>{averageDelay}</label>
                        }
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-4"><b>Limit:</b></label>
                    <div className="col-sm-8">
                        {isEditing ?
                            <input type="number" class="form-control" value={newLimit} onChange={e => this.setState({ newLimit: e.target.value })} /> :
                            <label>{limit}</label>
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
        </div>
    }
}