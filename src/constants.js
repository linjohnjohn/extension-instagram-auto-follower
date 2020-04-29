const K =  {
    taskType: {
        UNFOLLOW_LOOP: 'UNFOLLOW_LOOP',
        FOLLOW_LOOP: 'FOLLOW_LOOP',
        FOLLOW_UNFOLLOW_ALTERNATOR: 'FOLLOW_UNFOLLOW_ALTERNATOR',
        LOGIN: 'LOGIN',
        LOGOUT: 'LOGOUT',
        LIKE_USER_POSTS: 'LIKE_USER_POSTS'        
    },
    messageTypes: {
        IS_SESSION_MANAGER_ACTIVE: 'isSessionManagerActive',
        START_SESSION_MANAGER: 'startSessionManager',
        END_SESSION_MANAGER: 'endSessionManager',
        GET_MY_TAB_ID: 'getMyTabId',
        BACKSPACE_DELETE: 'backspaceDelete',
        LIKE_USER_POSTS: 'likeUserPosts',
        TYPE_STRING: 'typeString',
        FINISHED_TASK: 'finishedTasked',
    }
}

export default K;