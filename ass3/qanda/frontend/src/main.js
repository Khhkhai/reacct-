import { BACKEND_PORT } from './config.js';
import {
    getUserId,
    getThreadId,
    getToken,
    alertFn,
    showModal,
    hideModal,
    requireOnline
} from './helpers.js';
import {
    isUserLiked,
    getUserDetails,
    showUserInfo,
    showUserThreadList,
    editProfile
} from './userHelpers.js';
import {
    createThread,
    deleteThread,
    editThread,
    likeThread,
    fillUntilScrollable,
    getThreadDetails,
    resetThreads,
    showIndividualThreadScreen,
    showThreadList,
    updateLikeUI,
    updateWatchUI,
    watchThread
} from './threadHelpers.js';

import {
    getCommentById,
    submitComment,
    editComment,
    submitReply,
    handleLikeComment
} from './commentHelpers.js';
import {
    stopPollingThread,
    startWatchPolling,
    startPollingThread,
    stopWatchPolling
} from './polling.js';

const DEFAULT_PROFILE_PIC = './default-profile-pic.jpg';

// API CALL Helpers
export const apiCall = (method_call, path, body) => {
    const token = getToken();
    return fetch(`http://localhost:${BACKEND_PORT}` + path, {
            method: method_call,
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alertFn(data.error);
                return Promise.reject(data.error);
            } else {
                return data;
            }
        })
        .catch(err => {
            alertFn(err);
            return Promise.reject(err);
        });
}

export const apiGet = (path, token, queryString) => {
    return fetch(`http://localhost:${BACKEND_PORT}` + path + '?' + queryString, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            alertFn(data.error);
            return Promise.reject(data.error);
        } else {
            return data;
        }
    }).catch(err => {
        alertFn(err);
        return Promise.reject(err);
    });
};

export function renderDashboard(refreshList = false) {
    stopPollingThread();
    if (getUserId()) {
        getUserDetails(getUserId()).then((data) => {
            document.getElementById('profile-avatar').src = data.image || DEFAULT_PROFILE_PIC;
        });
    }
    showPage('dashboard-container');

    if (refreshList) {
        resetThreads();
        showThreadList().then(() => {
            fillUntilScrollable();
        });
    }

    const threadId = getThreadId();
    if (threadId) {
        document.getElementById('welcome-text').classList.add('d-none');
        document.getElementById('thread-container').classList.remove('d-none');
        getThreadDetails(threadId)
        .then((data) => {
            if (data) {
                showIndividualThreadScreen(data);
            } else {
                throw new Error();
            }
        })
        .catch(() => {
            const cached = localStorage.getItem('cachedThread');
            if (cached) {
                showIndividualThreadScreen(JSON.parse(cached));
            } else {
                alertFn("No internet and no cached data available.");
            }
        });
    } else {
        document.getElementById('welcome-text').classList.remove('d-none');
        document.getElementById('thread-container').classList.add('d-none');
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    return apiCall('POST' ,'/auth/login', {email, password}).then((data) => {
        if (!data) return
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        document.getElementById('login-form').reset(); 

        return renderDashboard(true);
    });
}

function register() {
    const email = document.getElementById('register-email').value;
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alertFn("Passwords do not match.");
        return;
    } 
    return apiCall('POST' ,'/auth/register', {email, name, password}).then((data) => {
        if (!data) return;
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        document.getElementById('register-form').reset(); 
        return renderDashboard(true);
    });
}

function showPage(page) {
    hidePages();
    document.querySelector(`#${page}`).classList.remove('d-none');
    const header = document.getElementById('app-header');
    if (page === 'dashboard-container' || page === 'profile-container') {
        header.classList.remove('d-none');  
    } else {
        header.classList.add('d-none');
    }
}

function hidePages() {
    document.querySelectorAll('.page').forEach((p) => {
        p.classList.add('d-none')
    });
}

// Page start 
document.addEventListener("DOMContentLoaded", () => {
    hidePages();
    if (getToken()) {
        startWatchPolling();
        handleURLrouting();
    } else {
        showPage('login-page');
    }
});

window.addEventListener('offline', () => {
    stopPollingThread();
    stopWatchPolling();
});

window.addEventListener('online', () => {
    const threadId = getThreadId();
    if (threadId) {
        startPollingThread(threadId);
    }
    startWatchPolling();
});

const handleURLrouting = () => {
    const route = window.location.hash;
    if (route.startsWith('#thread=')) {
        const threadId = route.split('=')[1];
        localStorage.setItem('threadId', threadId);
        renderDashboard();
    } else if (route.startsWith('#profile=')) {
        const userId = route.split('=')[1];
        showUserProfile(userId);
    } else if (route.startsWith('#profile')) {
        showUserProfile(getUserId());
    } else {
        renderDashboard(true);
    }
}

window.addEventListener('hashchange', handleURLrouting);

document.getElementById('register-link').addEventListener('click', (event) => {
    event.preventDefault();
    showPage('register-page')
});

document.getElementById('login-link').addEventListener('click', (event) => {
    event.preventDefault();
    showPage('login-page')
});

document.getElementById('home-title').addEventListener('click', (event) => {
    event.preventDefault();
    renderDashboard(true);
});

document.getElementById('profile-avatar').addEventListener('click', (event) => {
    event.preventDefault();
    showUserProfile(getUserId());
});

document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    login();
});

document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault();
    register();
});

document.getElementById('logout-button').addEventListener('click', () =>{
    localStorage.clear();
    window.location.reload();
    showPage('login-page');
});

/**
 * Thread
 */
document.getElementById('create-thread-button').addEventListener('click', (event) => {
    event.preventDefault();
    showPage('thread-page')
});

document.getElementById('create-thread-title').addEventListener('input', () => {
    document.getElementById('create-thread-submit').disabled = 
        document.getElementById('create-thread-title').value.trim() === '';
});

document.getElementById('create-thread-body').addEventListener('input', () => {
    document.getElementById('create-thread-submit').disabled = 
        document.getElementById('create-thread-body').value.trim() === '';
});

document.getElementById('create-thread-form').addEventListener('submit', (event) => {
    event.preventDefault();
    createThread().then(() => renderDashboard(true));
});

document.getElementById('create-thread-cancel').addEventListener('click', (event) => {
    event.preventDefault();
    renderDashboard();
});

document.getElementById('thread-list-container').addEventListener('click', (event) => {
    const container = event.target.closest('.list-thread-container');
    if (!container) return;

    const threadId = container.dataset.threadId;
    localStorage.setItem('threadId', threadId);
    if (window.innerWidth <= 768) {
        document.getElementById('dashboard-container').classList.add('thread-open');
    }
    renderDashboard();
});

document.getElementById('thread-list').addEventListener('scroll', () => {
    const scrollTop = document.getElementById('thread-list').scrollTop;
    const visibleHeight = document.getElementById('thread-list').clientHeight;
    const totalHeight = document.getElementById('thread-list').scrollHeight;

    const isAtBottom = scrollTop + visibleHeight >= totalHeight;

    if (isAtBottom) {
        showThreadList();
    }
});

document.getElementById('thread-edit-button').addEventListener('click', () => {
    showPage('edit-thread-container');
    getThreadDetails(getThreadId()).then((data) => {
        document.getElementById('edit-thread-title').value = data.title;
        document.getElementById('edit-thread-body').value = data.content;
        document.getElementById('edit-thread-private').checked = !data.isPublic;
        document.getElementById('edit-thread-locked').checked = data.lock;
    });
});

document.getElementById('edit-thread-title').addEventListener('input', () => {
    document.getElementById('edit-thread-submit').disabled = 
        document.getElementById('edit-thread-title').value.trim() === '';
});

document.getElementById('edit-thread-body').addEventListener('input', () => {
    document.getElementById('edit-thread-submit').disabled = 
        document.getElementById('edit-thread-body').value.trim() === '';
});

document.getElementById('edit-thread-form').addEventListener('submit', (event) => {
    event.preventDefault();
    editThread(getThreadId()).then(() => renderDashboard(true));
});

document.getElementById('edit-thread-cancel').addEventListener('click', (event) => {
    event.preventDefault();
    renderDashboard();
});

document.getElementById('thread-delete-button').addEventListener('click', (event) => {
    event.preventDefault();
    deleteThread(getThreadId()).then(() => renderDashboard(true));
});

document.getElementById('thread-like-toggle').addEventListener('click', (event) => {
    event.preventDefault();
    if (!requireOnline()) return;

    const isLiked = document.getElementById('thread-like-toggle').classList.contains('active');
    const newState = !isLiked;

    const component = {
        button: document.getElementById('thread-like-toggle'),
        icon: document.querySelector('#thread-like-toggle i'),
        likeCount: document.getElementById('thread-likes')
    };
    likeThread(getThreadId(), newState)
        .then(() => getThreadDetails(getThreadId()))
        .then((data) => {
            updateLikeUI(component, isUserLiked(data), data.likes.length);
        })
        .then(() => renderDashboard(true))
        .catch(() => {
            updateLikeUI(component, isLiked);
    });
});

document.getElementById('thread-watch-toggle').addEventListener('click', (event) => {
    event.preventDefault();
    if (!requireOnline()) return;
    const iswatching = document.getElementById('thread-watch-toggle').classList.contains('active');
    document.getElementById('thread-watch-toggle').classList.toggle('active', !iswatching);

    updateWatchUI(!iswatching);
    watchThread(getThreadId(), !iswatching);
});

/**
 * Comment
 */
document.getElementById('thread-comment-text').addEventListener('input', () => {
    document.getElementById('thread-comment-submit').disabled = 
        document.getElementById('thread-comment-text').value.trim() === '';
});

document.getElementById('thread-comment-submit').addEventListener('click', (event) => {
    event.preventDefault();
    if (!requireOnline()) return;
    submitComment();
});

document.addEventListener('click', (event) => {
    const like = event.target.closest('.comment-like-button');
    if (like) {
        if (!requireOnline()) return;
        return handleLikeComment(like);
    }
    const reply = event.target.closest('.comment-reply-button');
    if (reply) {
        if (!requireOnline()) return;
        const commentId = reply.dataset.commentId;
        const container = document.getElementById('comment-reply-container');
        showModal(container);
        localStorage.setItem('parentComment', commentId);
        return;
    }

    const edit = event.target.closest('.comment-edit-button');
    if (edit) {
        if (!requireOnline()) return;
        const commentId = edit.dataset.commentId;
        const container = document.getElementById('comment-edit-container');
        getCommentById(commentId).then((comment) => {
            document.getElementById('comment-edit-text').value = comment.content;
        })
        showModal(container);
        localStorage.setItem('commentId', commentId);
        return;
    }

    const profile = event.target.closest('.comment-profile-icon-btn, .list-comment-author');
    if (profile) {
        if (!requireOnline()) return;
        event.preventDefault();
        const userId = profile.dataset.userId;
        if (userId) {
            showUserProfile(Number(userId));
        }
        return;

    }
});

document.getElementById('comment-reply-text').addEventListener('input', () => {
    document.getElementById('comment-reply-submit').disabled = 
        document.getElementById('comment-reply-text').value.trim() === '';
});

document.getElementById('comment-reply-submit').addEventListener('click', (event) => {
    event.preventDefault();
    submitReply(localStorage.getItem('parentComment')).then(() => {
        hideModal(document.getElementById('comment-reply-container'));
        document.getElementById('comment-reply-text').value = '';
    })
});

document.getElementById('comment-edit-text').addEventListener('input', () => {
    document.getElementById('comment-edit-submit').disabled = 
        document.getElementById('comment-edit-text').value.trim() === '';
});

document.getElementById('comment-edit-submit').addEventListener('click', (event) => {
    event.preventDefault();
    editComment(localStorage.getItem('commentId')).then(() => {
        hideModal(document.getElementById('comment-edit-container'));
        document.getElementById('comment-edit-text').value = '';
    });
});


/**
 * User
 */
const showUserProfile = (id) => {
    showPage('profile-container');
    document.getElementById('profile-thread-list').replaceChildren();
    showUserInfo(id).then(() => {
        showUserThreadList(id);
    });
}

document.getElementById('thread-author').addEventListener('click', (event) => {
    event.preventDefault();
    getThreadDetails(getThreadId()).then((data) => showUserProfile(data.creatorId));
});

document.getElementById('thread-profile-icon-btn').addEventListener('click', (event) => {
    event.preventDefault();
    getThreadDetails(getThreadId()).then((data) => showUserProfile(data.creatorId));
});

document.getElementById('profile-edit-button').addEventListener('click', (event) => {
    event.preventDefault();
    const container = document.getElementById('profile-edit-container');
    showModal(container);
});

document.getElementById('edit-profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    editProfile(getUserId()).then(() => {
        hideModal(document.getElementById('profile-edit-container'));
        document.getElementById('edit-profile-form').reset(); 
        showUserProfile(getUserId())
    });
});

document.getElementById('user-permission-submit').addEventListener('click',(event) => {
    event.preventDefault();
    const permission = document.getElementById('user-permission').value == 'admin' ? true : false;
    const userId = document.getElementById('admin-only').dataset.userId;
    apiCall('PUT' ,'/user/admin', { userId, "turnon": permission }).then(() => showUserProfile(userId));
});

/**
 * mobile version
 */
document.getElementById('back-button').addEventListener('click', () => {
    document.getElementById('dashboard-container').classList.remove('thread-open');
});