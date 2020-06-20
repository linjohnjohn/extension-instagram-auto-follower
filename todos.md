
3. 
-d Fix follow unfollow altenator
-d fix for once a day
- Wait task
- Direct Commands from BG script
4. Locking/semi-locking windows/tabs


## How to use ##

This extension will allow you to COMPLETELY automate your follow for follow strategy for MULTIPLE accounts. Yes that's right, after you set it up you can leave it running for days, weeks or even months just so long as your browser is active.

Quick start
- create and name a session
- in that session create a LOGOUT task
- then create a LOGIN task, in that LOGIN task fill in the username and password you use to login to your instagram account
- then create a FOLLOW_UNFOLLOW_ALTERNATOR task, fill in the Average Delay (Recommend 60-200), in seconds, that you roughly want to wait between each follow or unfollow operation, the Limit which is the maximum number of users to follow or unfollow in that task (Recommend 200-600) and the Sources which should be instagram url links that you want to be following from. The links provided should be links to instagram picture posts (since only pictures posts revealed who has liked the post and we are doing the following based on people who have liked the post). These linked picture posts should ideally be posts from within your niche so you are targeting a relevant audience to follow. Then fill in the Upper Switch and Lower Switch which specifies at which point the ALTERNATOR task switches from following to unfollowing vice versa. (For example, if Upper Switch is 1000 then after you have 1000 following it will begin unfollowing and if Lower Switch is 100 then after you have less than 100 following it will begin following users again) 
- repeat and create other sessions for any other instagram accounts you have
- Then click Run Sessions on the main options page


Task Details

LOGIN - a login tasks will log you from a logged out state into your instagram account. It needs the username and password you would use to login into your instagram account (We take your security very seriously so we only store these credentials locally on your machine)

LOGOUT - a logout task will log you out of instagram (if you are logged out already it won't do anything)

FOLLOW_LOOP - 

A follow loop will automatically follow users based on the links provided in sources. The links provided should be links to instagram picture posts (since only pictures posts revealed who has liked the post and we are doing the following based on people who have liked the post). These linked picture posts should ideally be posts from within your niche so you are targeting a relevant audience to follow. Average Delay just specifies how long, in seconds, the task should wait on average (since we include grouping ands some randomness) before following each user (We recommend anywhere from 60-200 depending on the size and history of your account). Limit specifies the maximum number of users to follow in that task (Recommended: Anything under 500 since that is roughly instagram's limit)

UNFOLLOW_LOOP -

A unfollow loop will automatically unfollow users. Average Delay specifies how long, in seconds, the task should wait on average before unfollowing each user.  Limit specifies the maximum number of users to unfollow in that task.

FOLLOW_UNFOLLOW_ALTERNATOR - 

A follow unfollow alternator is probably what you're looking for in most cases to automate your FFF strategy. Fill in Average Delay (Recommend 60-200), in seconds, that you roughly want to wait between each follow or unfollow operation, the Limit which is the maximum number of users to follow or unfollow in that task (Recommend 200-600) and the Sources which should be instagram url links that you want to be following from. The links provided should be links to instagram picture posts (since only pictures posts revealed who has liked the post and we are doing the following based on people who have liked the post). These linked picture posts should ideally be posts from within your niche so you are targeting a relevant audience to follow. Then fill in the Upper Switch and Lower Switch which specifies at which point the ALTERNATOR task switches from following to unfollowing vice versa. (For example, if Upper Switch is 1000 then after you have 1000 following it will begin unfollowing and if Lower Switch is 100 then after you have less than 100 following it will begin following users again) 

LIKE_USER_POSTS

Still in development. You should not use this task yet.