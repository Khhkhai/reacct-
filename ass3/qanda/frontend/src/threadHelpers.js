import { apiCall, apiGet } from './main.js';
import { getUserId, getToken , getThreadId } from './helpers.js';
import { getUserDetails, isUserLiked, isUserWatchingPost} from './userHelpers.js';
import { getComments, showCommentList } from './commentHelpers.js'
import { addWatchThread, removeWatchThread, startPollingThread } from './polling.js'


const DEFAULT_PROFILE_PIC = './default-profile-pic.jpg';
let threads = [];
let start = 0;
let hasMore = true;
let isLoading = false;

/**
 * Return the list of 5 thread id
 */
export const loadThreads = (start) => apiGet('/threads', getToken(), `start=${start}`);

/**
 * Return the thread obj of given id
 */
export const getThreadDetails = (id) => apiGet('/thread', getToken(), `id=${id}`);

/**
 * Take the value on create-thread-page and create a thread
 */
export const createThread = () => {
    const data = {
        "title": document.getElementById('create-thread-title').value,
        "isPublic": !document.getElementById('create-thread-private').checked,
        "content": document.getElementById('create-thread-body').value
    }
    document.getElementById('create-thread-submit').disabled = true;
    return apiCall('POST' ,'/thread', data).then((thread) => {
        localStorage.setItem('threadId', thread.id);
        document.getElementById('create-thread-form').reset(); 
    });  
}

/**
 * Take the value on edit-thread-page and update the thread
 */
export const editThread = (id) => {
    const data = {
        "id": id,
        "title": document.getElementById('edit-thread-title').value,
        "isPublic": !document.getElementById('edit-thread-private').checked,
        "lock": document.getElementById('edit-thread-locked').checked,
        "content": document.getElementById('edit-thread-body').value
    }
    document.getElementById('edit-thread-submit').disabled = true;
    return apiCall('PUT' ,'/thread', data).then(() => {
        document.getElementById('edit-thread-form').reset(); 
    });  
}

/**
 * delete the thread and hide everything related
 * and show the latest thread
 */
export const deleteThread = (id) => {
    return apiCall('DELETE', '/thread', { id })
    .then(() => {
        localStorage.removeItem('threadId');
        document.getElementById('comment-list-container').replaceChildren();
        return loadThreads(0).then((threads) => {
            if (threads.length !== 0 ) {
                localStorage.setItem('threadId', threads[0]);
            }
        });
    })
}

/**
 * Like/unlike a thread
 */
export const likeThread = (id, isLiked) =>
    apiCall('PUT', '/thread/like', {"id": id, "turnon": isLiked});

/**
 * Watch/unwatch a thread
 */
export const watchThread = (id, iswatching) =>
    apiCall('PUT', '/thread/watch', {"id": id, "turnon": iswatching});

/**
 * Create a thread post and set the state
 */
export const showIndividualThreadScreen = (data) => {
    localStorage.setItem('cachedThread', JSON.stringify(data));
    document.getElementById('thread-title').textContent = data.title;
    getUserDetails(data.creatorId).then((user) => {
        document.getElementById('thread-author').textContent = user.name;
        document.getElementById('thread-profile-icon').src = user.image || DEFAULT_PROFILE_PIC;
    });
    document.getElementById('thread-body').textContent = data.content;
    document.getElementById('thread-likes').textContent = data.likes.length;
    getUserDetails(getUserId()).then((user) => {
        updateThreadPermissions(data, user);
    });
    const component = {
        button: document.getElementById('thread-like-toggle'),
        icon: document.querySelector('#thread-like-toggle i'),
        likeCount: document.getElementById('thread-likes')
    };
    updateLikeUI(component, isUserLiked(data), data.likes.length);
    updateWatchUI(isUserWatchingPost(data));
    showCommentList();
    startPollingThread(data.id);
}

/**
 * Update permissions of thread functionalities 
 */
export const updateThreadPermissions = (data, user) => {
    const editButton = document.getElementById('thread-edit-button');
    const deleteButton = document.getElementById('thread-delete-button');
    const likeButton = document.getElementById('thread-like-toggle');
    const commentText = document.getElementById('thread-comment-text');
    const commentButton = document.getElementById('thread-comment-submit');

    editButton.classList.remove('d-none');
    deleteButton.classList.remove('d-none');
    likeButton.classList.remove('d-none');
    commentText.classList.remove('d-none');
    commentButton.classList.remove('d-none');

    if (!user.admin && user.id != data.creatorId) {
        editButton.classList.add('d-none');
        deleteButton.classList.add('d-none');
    }

    if (data.lock) {
        likeButton.classList.add('d-none');
        editButton.classList.add('d-none');
        commentText.classList.add('d-none');
        commentButton.classList.add('d-none');
    }
}

/**
 * Load thread and create list 
 * load more threads everytime it's called and append the list
 */
export const showThreadList = () => {
    if (!hasMore || isLoading) {
        return Promise.resolve();
    }
    isLoading = true;
    document.getElementById('thread-loading').classList.remove('d-none');
    return loadThreads(start)
        .then(ids => Promise.all(ids.map(getThreadDetails)))
        .then(results => {
            if (!results.length) {
                hasMore = false;
                return [];
            }

            threads.push(...results);
            start += results.length;
            results.forEach(createListThreadContainer);
            return results;
        })
        .finally(() => {
            isLoading = false;
            document.getElementById('thread-loading').classList.add('d-none');
        });
}

/**
 * Fill up the thread-list-continer to screen height so that load at scroll work
 */
export const fillUntilScrollable = () => {
    const container = document.getElementById('thread-list');
    const scrollable = container.scrollHeight > container.clientHeight;
    if (scrollable || !hasMore) return;

    showThreadList().then(() => {
        fillUntilScrollable();
    });
}

/**
 * Clear the thread-list-container and threads list
 */
export const resetThreads = () => {
    threads = [];
    start = 0;
    hasMore = true;
    document.getElementById('thread-list-container').replaceChildren();
}

/**
 * Create a component inside thread-list-container
 */
const createListThreadContainer = (data) => {
    const template = document.getElementById('list-thread-template');
    const container = template.content.firstElementChild.cloneNode(true);
    container.dataset.threadId = data.id;

    getUserDetails(data.creatorId).then((user) => {
        container.querySelector('.list-thread-author').textContent = user.name;
    });
    container.querySelector('.list-thread-title').textContent = data.title;
    container.querySelector('.list-thread-date').textContent = data.createdAt.substring(0,10);
    container.querySelector('.list-thread-likes').textContent = data.likes.length;

    const type = data.isPublic ? "Public" : "Private";
    container.querySelector('.list-thread-type').textContent = type;
    document.getElementById('thread-list-container').appendChild(container);
}

/**
 * Update Like UI
 */
export const updateLikeUI = (component, state, count) => {
    component.button.classList.toggle('active', state);
    if (state) {
        liked(component.icon);
    } else {
        unliked(component.icon);
    }
    component.likeCount.textContent = count;
}

const liked = (likeIcon) => {
    likeIcon.classList.replace("bi-heart", "bi-heart-fill");
    likeIcon.classList.add("liked");
}

const unliked = (likeIcon) => {
    likeIcon.classList.replace("bi-heart-fill", "bi-heart");
    likeIcon.classList.remove("liked");
}

/**
 * Update Watch UI
 */
export const updateWatchUI = (state) => {
    if (state) {
        watching();
        addWatchThread(getThreadId());
    } else {
        notWatching();
        removeWatchThread(getThreadId());
    }
}
const icon = document.querySelector('#thread-watch-toggle i');
const status = document.getElementById("thread-watch-status");

const watching = () => {
    icon.classList.replace("bi-eye", "bi-eye-fill");
    icon.classList.add("watching");
    status.classList.add("watching");
    status.textContent = "Watching";
}

const notWatching = () => {
    icon.classList.replace("bi-eye-fill", "bi-eye");
    icon.classList.remove("watching");
    status.classList.remove("watching");
    status.textContent = "Watch";
}