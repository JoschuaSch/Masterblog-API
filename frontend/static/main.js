// Function that runs once the window is fully loaded
window.onload = function() {
    var savedBaseUrl = localStorage.getItem('apiBaseUrl');
    if (savedBaseUrl) {
        document.getElementById('api-base-url').value = savedBaseUrl;
        loadPosts();
    }
}

function loadPosts() {
    var baseUrl = document.getElementById('api-base-url').value;
    localStorage.setItem('apiBaseUrl', baseUrl);

    fetch(baseUrl + '/posts')
        .then(response => response.json())
        .then(data => {
            // Sort the posts by date in descending order
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';
            data.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `
                    <div class="post-header">
                        <p class="post-id">NR. ${post.id}</p>
                        <p class="author">Written by ${post.author}</p>
                        <p class="date">${post.date}</p>
                    </div>
                    <h2>${post.title}</h2>
                    <p class="content-preview">${post.content.substring(0, 100)}...</p>
                    <button onclick="deletePost(${post.id})">Delete</button>`;

                postDiv.addEventListener('click', function(event) {
                    if (event.target.tagName !== 'BUTTON') {
                        const allPosts = document.querySelectorAll('.post');
                        allPosts.forEach(p => {
                            p.classList.remove('expanded');
                            p.querySelector('.content-preview').innerText = p.querySelector('.content-preview').innerText.substring(0, 100) + '...';
                        });

                        this.classList.toggle('expanded');
                        this.querySelector('.content-preview').innerText = this.classList.contains('expanded') ? post.content : post.content.substring(0, 100) + '...';
                    }
                });

                postContainer.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

function addPost() {
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById('post-title');
    var postContent = document.getElementById('post-content');
    var postAuthor = document.getElementById('post-author');

    fetch(baseUrl + '/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle.value, content: postContent.value, author: postAuthor.value })
    })
    .then(response => response.json())
    .then(post => {
        console.log('Post added:', post);
        loadPosts();
        postTitle.value = '';
        postContent.value = '';
        postAuthor.value = '';
        modal.style.display = "none";
    })
    .catch(error => console.error('Error:', error));
}

function deletePost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;

    fetch(baseUrl + '/posts/' + postId, {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Post deleted:', postId);
        loadPosts();
    })
    .catch(error => console.error('Error:', error));
}

//Modal logic
var modal = document.getElementById("addPostModal");
var btn = document.getElementById("openAddPostModal");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}