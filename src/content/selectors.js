export const selectFollowingOpener = () => {
    return document.querySelectorAll('.-nal3')[2];
}

export const selectFollowingCount = () => {
    return document.querySelectorAll('.-nal3 .g47SY')[2];
}

/**
 * This is the button/link you press to open the panel of people who have liked a post
 */
export const selectLikersOpener = () => {
    return document.querySelector('section.EDfFK.ygqzn div.Nm9Fw button.sqdOP.yWX7d._8A5w5')
}

export const selectProfileIcon = () => {
    return document.querySelector('div.Fifk5 a._2dbep.qNELH.kIKUG');
}

export const selectProfileIconAsSpan = () => {
    return document.querySelector('div.Fifk5 span._2dbep.qNELH');
}

export const selectProfileOnDropdown = () => {
    return document.querySelectorAll('a.-qQT3')[0];
}

export const selectLogoutOnDropdown = () => {
    return document.querySelector('div.-qQT3');
}

export const selectLogoutConfirm = () => {
    return document.querySelector('button.aOOlW.bIiDR');
}

export const selectHomeIcon = () => {
    return document.querySelectorAll('div.Fifk5 a')[0];
}
export const selectAllCommentLikeIcons = () => {
    return Array.from(document.querySelectorAll('button.wpO6b.ZQScA svg[aria-label="Like"]'));
}

export const selectAllFollowButtons = () => {
    return Array.from(document.querySelectorAll('.sqdOP.L3NKy.y3zKF:not(._8A5w5)'))
}

export const selectAllUnfollowButtons = () => {
    return Array.from(document.querySelectorAll('.sqdOP.L3NKy._8A5w5:not(._4pI4F)'));
}

export const selectLikeButton = () => {
    return document.querySelector('span.fr66n .wpO6b');
}

export const selectNextPostArrow = () => {
    return document.querySelector('a._65Bje.coreSpriteRightPaginationArrow')
}

export const selectProfileGear = () => {
    return document.querySelector('.wpO6b');
}

export const selectLogoutButton = () => {
    return Array.from(document.querySelectorAll('button.aOOlW')).filter(node => node.textContent === 'Log Out')[0];
}

export const selectSwitchAccountButton = () => {
    return document.querySelector('span.bTref .sqdOP.yWX7d.y3zKF');
}

export const selectUsernameInput = () => {
    return document.querySelectorAll('input._2hvTZ.pexuQ.zyHYP')[0];
}

export const selectPasswordInput = () => {
    return document.querySelectorAll('input._2hvTZ.pexuQ.zyHYP')[1];
}

export const selectLoginButton = () => {
    return document.querySelector('button.sqdOP.L3NKy.y3zKF');
}

export const selectLatestPostSquare = () => {
    return document.querySelector('.eLAPa');
}