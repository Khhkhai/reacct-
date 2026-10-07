import { apiCall, apiGet} from './main.js';
import { getUserId, getToken, fileToDataUrl } from './helpers.js';
import { loadThreads, getThreadDetails } from './threadHelpers.js';
import { getComments } from './commentHelpers.js';

const DEFAULT_PROFILE_PIC = './default-profile-pic.jpg';

export const getUserDetails = (id) => apiGet('/user', getToken(), `userId=${id}`);

export const isUserLiked = (data) => data.likes.includes(Number(getUserId()));

export const isUserWatchingPost = (data) => data.watchees.includes(Number(getUserId()));


export const showUserInfo = (id) => {
    return getUserDetails(id).then((data) => {
        document.getElementById('profile-name').textContent = data.name;
        document.getElementById('profile-email').textContent = data.email;
        document.getElementById('profile-img').src = data.image || DEFAULT_PROFILE_PIC;
        document.getElementById('profile-admin').textContent = data.admin ? "Admin" : "User";
        getUserDetails(getUserId()).then((user) => {
            if (user.admin) {
                document.getElementById('admin-only').classList.remove('d-none');
                document.getElementById('admin-only').dataset.userId = data.id;
            } else {
                document.getElementById('admin-only').classList.add('d-none');
            }
        });
        
        if (id !== getUserId()) {
            document.getElementById('profile-edit-button').classList.add('d-none');
        } else {
            document.getElementById('profile-edit-button').classList.remove('d-none');
        }
})}

export const showUserThreadList = (id, start = 0) => {
    return loadThreads(start)
        .then(ids => Promise.all(ids.map(getThreadDetails)))
        .then(results => {
            if (!results.length) {
                return;
            }
            const userThreads = results.filter(
                thread => thread.creatorId === parseInt(id)
            );
            userThreads.forEach(thread => {
                createProfileThreadContainer(thread)
            });
            return showUserThreadList(id, start + 5);
        })
}

export const createProfileThreadContainer = (data) => {
    const container = document.getElementById('profile-thread-container-template').cloneNode(true);
    container.removeAttribute('id');
    container.id = data.id;
    container.classList.remove('d-none');

    container.querySelector('.profile-thread-title').textContent = data.title;
    container.querySelector('.profile-thread-content').textContent = data.content;
    container.querySelector('.profile-thread-likes').textContent = data.likes.length;
    getComments(data.id).then((comments) => {
        container.querySelector('.profile-thread-comments').textContent = comments.length;
    })
    document.getElementById('profile-thread-list').appendChild(container);
}

export const editProfile = () => {
    const name = document.getElementById('edit-profile-name').value;
    const email = document.getElementById('edit-profile-email').value;
    const password = document.getElementById('edit-profile-password').value;
    const imageRaw = document.getElementById('edit-profile-image').files[0];
    if (!imageRaw) {
        return apiCall('PUT' ,'/user', { name, email, password, imageRaw });
    }
    return fileToDataUrl(imageRaw).then((image) => {
        return apiCall('PUT' ,'/user', { name, email, password, image }).then(() => {
            document.getElementById('profile-avatar').src = image;
        })
    })
}
