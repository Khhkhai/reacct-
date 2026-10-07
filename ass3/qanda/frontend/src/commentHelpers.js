import { apiCall, apiGet } from './main.js';
import { getThreadId, getToken } from './helpers.js';
import { getUserDetails, isUserLiked } from './userHelpers.js';
import { updateLikeUI } from  './threadHelpers.js'; 

const DEFAULT_PROFILE_PIC = './default-profile-pic.jpg';

/**
 * Return all the comments related to thread 
 */
export const getComments = (id) =>  apiGet('/comments', getToken(), `threadId=${id}`);

/**
 * Return the comment object of given id from current thread 
 */
export const getCommentById = (commentId) => {
    return getComments(getThreadId()).then((comments) => {
        return comments.find(c => c.id == commentId);
    });
};

/**
 * Create a new comment and show at the top of the comment list
 * Reject empty comment
 */
export function submitComment() {
    const content = document.getElementById('thread-comment-text').value;
    if (!content.trim()) return;
    document.getElementById('thread-comment-submit').disabled = true;

    return apiCall('POST', '/comment', { content, "threadId": getThreadId(), "parentCommentId": null})
        .then((data) => {
            return getCommentById(data.id);
        })
        .then((newComment) => {
            const node = createListCommentContainer(newComment);
            document.getElementById('comment-list-container').prepend(node);
            document.getElementById('thread-comment-text').value = '';
        });
}

/**
 * Create a new comment and show at the top of the comment list
 * Reject empty comment
 */
export function editComment(id) {
    const content = document.getElementById('comment-edit-text').value;
    if (!content.trim()) return;
    document.getElementById('comment-edit-submit').disabled = true;

    return apiCall('PUT', '/comment', { id, content }).then(() => {
        const comment = document.querySelector(`[data-comment-id="${id}"]`);
        if (!comment) return;

        comment.querySelector('.list-comment-body').textContent = content;
        document.getElementById('comment-edit-text').value = '';
    });
}

/**
 * Delete all the comments of a thread
 */
export function deleteComments(id) {
    return getComments(id).then((comments) => {
        return Promise.all(
            comments.map(comment =>
                apiCall('DELETE', '/comment', { id: comment.id })
            )
        );
    });
}

/**
 * Like or unlike a comment
 */
export const likeComment = (id, isLiked) => 
    apiCall('PUT', '/comment/like', {"id": id, "turnon": isLiked});

/**
 * Create a new reply and add it to parent container
 * Reject empty comment
 */
export function submitReply(parentCommentId) {
    const content = document.getElementById('comment-reply-text').value;
    if (!content.trim()) return;
    document.getElementById('comment-reply-submit').disabled = true;
    return apiCall('POST', '/comment', {"content": content, "threadId": getThreadId(), "parentCommentId": parentCommentId})
        .then((data) => {
            return getCommentById(data.id);
        })
        .then((newReply) => {
            const parent = document.querySelector(`[data-comment-id="${parentCommentId}"]`);
            if (! parent) return;

            const node = createListCommentContainer(newReply);
            parent.querySelector('.list-comment-reply').appendChild(node);
        });
}

/**
 * Construct the comment lists of a thread
 * most recent comments at the top and
 * oldest reply comments at the top in nested 
 */
export const showCommentList = () => {
    document.getElementById('comment-list-container').replaceChildren();
    getComments(getThreadId()).then((comments) => {
        localStorage.setItem('cachedComments', JSON.stringify(comments));
        const map = {};
        comments.forEach(comment => {
            map[comment.id] = createListCommentContainer(comment);
        });
        const rootComments = comments
            .filter(c => !c.parentCommentId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const replies = comments
            .filter(c => c.parentCommentId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        rootComments.forEach(comment => {
            document.getElementById('comment-list-container').appendChild(map[comment.id]);
        });

        replies.forEach(comment => {
            const parent = map[comment.parentCommentId];
            if (parent) {
                parent.querySelector('.list-comment-reply').appendChild(map[comment.id]);
            }
        });
    }).catch(() => {
        const cached = localStorage.getItem('cachedComments');
        if (cached) {
            render(JSON.parse(cached));
        } 
    });
}

/**
 * Create a comment component
 */
function createListCommentContainer(data) {
    const template = document.getElementById('list-comment-template');
    const container = template.content.firstElementChild.cloneNode(true);
    container.dataset.commentId = data.id;

    container.querySelectorAll('[data-comment-id]').forEach(elements => {
        elements.dataset.commentId = data.id;
    });

    container.querySelectorAll('[data-user-id]').forEach(elements => {
        elements.dataset.userId = data.creatorId;
    });

    container.querySelector('.list-comment-body').textContent = data.content;
    container.querySelector('.list-comment-date').textContent = commentTime(data.createdAt);
    container.querySelector('.list-comment-likes').textContent = data.likes.length;

    getUserDetails(data.creatorId).then((user) => {
        container.querySelector('.list-comment-author').textContent = user.name;
        container.querySelector('.comment-profile-icon').src = user.image || DEFAULT_PROFILE_PIC;
    });

    const component = {
        button: container.querySelector('.comment-like-button'),
        icon: container.querySelector('.comment-like-button i'),
        likeCount: container.querySelector('.list-comment-likes')
    };
    updateLikeUI(component, isUserLiked(data), data.likes.length);
    return container;
}

/**
 * Format comment time 
 */
const commentTime = (postedTime) => {
    const now = new Date().getTime() / 1000;
    const time = new Date(postedTime).getTime() / 1000;

    const diff = now - time;
    if (diff < 60) {
        return "Just now";
    } else if (diff < 3600) {
        const mins = Math.floor(diff / 60);
        return `${mins} minute(s) ago`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hour(s) ago`;
    } else if (diff < 604800) {
        const days = Math.floor(diff / 86400);
        return `${days} day(s) ago`;
    } else {
        const weeks = Math.floor(diff / 604800);
        return `${weeks} week(s) ago`;
    }
}

/**
 * Handle Like Comment update
 */
export const handleLikeComment = (clickedComponent) => {
    const commentId = clickedComponent.dataset.commentId;
    const isLiked = clickedComponent.classList.contains('active');

    const component = {
        button: clickedComponent,
        icon: clickedComponent.querySelector('i'),
        likeCount: clickedComponent.querySelector('.list-comment-likes')
    };

    const currentCount = parseInt(component.likeCount.textContent) || 0;
    const newState = !isLiked;
    const newCount = Math.max(0, currentCount + (isLiked ? -1 : 1));

    updateLikeUI(component, newState, newCount);

    likeComment(commentId, newState).catch(() => {
        updateLikeUI(component, isLiked, currentCount);
    });
}