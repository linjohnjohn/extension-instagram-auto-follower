import React from 'react';
import K from '../constants';
import TaskAPI from '../models/TaskAPI';

export default class extends React.Component {
    state = {
        task: {}
    }

    componentDidMount = async () => {
        const { taskId } = this.props.match.params;
        const task = await TaskAPI.getTask(taskId);
        console.log(task);
        this.setState({ task });
    }

    handleSaveEdit = async (updatedTask) => {
        const { taskId } = this.props.match.params;
        await TaskAPI.updateTask(taskId, updatedTask);
        this.setState({ task: updatedTask });
    }

    renderTask(task) {
        switch (task.type) {
            case K.taskType.FOLLOW_LOOP:
                return <FollowLoopView handleSaveEdit={this.handleSaveEdit} task={task} />
            case K.taskType.UNFOLLOW_LOOP:
                return <UnfollowLoopView handleSaveEdit={this.handleSaveEdit} task={task} />
            case K.taskType.FOLLOW_UNFOLLOW_ALTERNATOR:
                return <FollowUnfollowAlternatorView handleSaveEdit={this.handleSaveEdit} task={task} />
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

        return <>
            <h3>Task: {task.uid}</h3>
            {this.renderTask(task)}
        </>
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
    }
}

class LogoutView extends React.Component {
    render() {
        const { task } = this.props;
        const { uid, type } = task;

        return <div>
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
    }
}

class FollowUnfollowAlternatorView extends React.Component {
    state = {
        isEditing: false,
        newAverageDelay: 0,
        newLimit: 0,
        newUpperSwitch: 0,
        newLowerSwitch: 0,
        newSources: '',
    }

    handleToggleEdit = () => {
        const { task } = this.props;
        const { averageDelay, limit, sources, lowerSwitch, upperSwitch } = task;
        this.setState({
            isEditing: true,
            newAverageDelay: averageDelay,
            newLimit: limit,
            newLowerSwitch: lowerSwitch,
            newUpperSwitch: upperSwitch,
            newSources: sources.join('\n')
        });
    }

    handleSaveEdit = () => {
        const { task } = this.props;
        const { newAverageDelay, newLimit, newSources, newLowerSwitch, newUpperSwitch } = this.state;
        const newTask = {
            ...task,
            averageDelay: newAverageDelay,
            limit: newLimit,
            lowerSwitch: newLowerSwitch,
            upperSwitch: newUpperSwitch,
            sources: newSources.split('\n')
        };
        this.props.handleSaveEdit(newTask);
        this.setState({ isEditing: false });
    }

    handleCancelEdit = () => {
        this.setState({ isEditing: false });
    }

    render() {
        const { task } = this.props;
        let { uid, type, averageDelay, limit, upperSwitch, lowerSwitch, sources } = task;
        sources = sources.join('\n');
        const { isEditing, newAverageDelay, newLimit, newUpperSwitch, newLowerSwitch, newSources } = this.state;

        return <div>
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
                <label class="col-sm-4"><b>Lower Switch:</b></label>
                <div className="col-sm-8">
                    {isEditing ?
                        <input type="number" class="form-control" value={newLowerSwitch} onChange={e => this.setState({ newLowerSwitch: e.target.value })} /> :
                        <label>{lowerSwitch}</label>
                    }
                </div>
            </div>

            <div className="form-group row">
                <label class="col-sm-4"><b>Upper Switch:</b></label>
                <div className="col-sm-8">
                    {isEditing ?
                        <input type="number" class="form-control" value={newUpperSwitch} onChange={e => this.setState({ newUpperSwitch: e.target.value })} /> :
                        <label>{upperSwitch}</label>
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
    }
}

