import { updateLikeUI, getThreadDetails} from './threadHelpers.js'
import { isUserLiked } from './userHelpers.js'
import { getComments, showCommentList } from './commentHelpers.js'

let pollInterval = null;
let currentThreadId = null;
let lastCommentCount = 0;

export const startPollingThread = (threadId) => {
    stopPollingThread();
    currentThreadId = threadId;
    pollInterval = setInterval(() => {
        if (!navigator.onLine) return;
        refreshThread(threadId);
    }, 3000);
}

export const stopPollingThread = () => {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
    currentThreadId = null;
}

/**
 * Check and update likes or comments
 */
const refreshThread = (threadId) => {
    if (threadId !== currentThreadId) return;

    const container = document.getElementById('thread-container');
    if (!container || container.classList.contains('d-none')) return;

    getThreadDetails(threadId).then((data) => {
        const component = {
            button: document.getElementById('thread-like-toggle'),
            icon: document.getElementById('thread-like-toggle').querySelector('i'),
            likeCount: document.getElementById('thread-likes')
        };
        updateLikeUI(component, isUserLiked(data), data.likes.length);
    });
    getComments(threadId).then((comments) => {
        if (comments.length !== lastCommentCount) {
            lastCommentCount = comments.length;
            showCommentList();
        }
    });
}

let watchedThreads = new Set(); 
let lastCommentCountMap = new Map(); 
let watchPoll = null;

export const startWatchPolling = () => {
    if (watchPoll) return;

    initWatchedThreadCounts();
    watchPoll = setInterval(() => {
        if (!navigator.onLine) return;
        pollWatchedThreads();
    }, 3000);
}

export const stopWatchPolling = () => {
    if (watchPoll) {
        clearInterval(watchPoll);
        watchPoll = null;
    }
}

export const addWatchThread = (threadId) => {
    watchedThreads.add(threadId);
};

export const removeWatchThread = (threadId) => {
    watchedThreads.delete(threadId);
    lastCommentCountMap.delete(threadId);
};

const initWatchedThreadCounts = () => {
    watchedThreads.forEach(threadId => {
        getComments(threadId).then(comments => {
            lastCommentCountMap.set(threadId, comments.length);
        });
    });
};

/**
 * Poll watched threads for new comments
 */
const pollWatchedThreads = () => {
    watchedThreads.forEach(threadId => {
        getComments(threadId).then(comments => {
            const newCount = comments.length;
            const oldCount = lastCommentCountMap.get(threadId);

            if (oldCount !== undefined && newCount > oldCount) {
                getThreadDetails(threadId).then(data => {
                    showToast(data.title);
                });
            }
            lastCommentCountMap.set(threadId, newCount);
        });
    });
}

const showToast = (title) => {
    const toastEl = document.getElementById('my-toast');
    document.getElementById('thread-title-noti').textContent = title;
    new bootstrap.Toast(toastEl).show();
};