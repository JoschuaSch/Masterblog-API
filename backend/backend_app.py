from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

POSTS = [
    {"id": 1, "title": "First post", "content": "This is the first post."},
    {"id": 2, "title": "Second post", "content": "This is the second post."},
]


@app.route('/api/posts', methods=['GET'])
def get_posts():
    sort_key = request.args.get('sort')
    direction = request.args.get('direction')
    valid_sort_keys = ['title', 'content']
    if sort_key and sort_key not in valid_sort_keys:
        return jsonify({"message": "Invalid sort field. Valid fields are 'title' and 'content'."}), 400
    if direction and direction not in ['asc', 'desc']:
        return jsonify({"message": "Invalid sort direction. Valid directions are 'asc' and 'desc'."}), 400
    if sort_key:
        return jsonify(sorted(POSTS, key=lambda x: x[sort_key], reverse=direction == 'desc'))
    return jsonify(POSTS)


@app.route('/api/posts', methods=['POST'])
def add_post():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    if not title or not content:
        return jsonify({"message": "Title and content are required"}), 400
    new_id = max(post["id"] for post in POSTS) + 1 if POSTS else 1
    new_post = {
        "id": new_id,
        "title": title,
        "content": content,
    }
    POSTS.append(new_post)
    return jsonify(new_post), 201


@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = next((post for post in POSTS if post["id"] == post_id), None)
    if post is None:
        return jsonify({"message": f"Post with id {post_id} not found"}), 404
    POSTS.remove(post)
    return jsonify({"message": f"Post with id {post_id} has been deleted successfully."}), 200


@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post = next((post for post in POSTS if post["id"] == post_id), None)
    if post is None:
        return jsonify({"message": f"Post with id {post_id} not found"}), 404
    data = request.get_json()
    post.update({
        "title": data.get("title", post["title"]),
        "content": data.get("content", post["content"]),
    })
    return jsonify(post), 200


@app.route('/api/posts/search', methods=['GET'])
def search_posts():
    title_term = request.args.get('title', '')
    content_term = request.args.get('content', '')
    matching_posts = [post for post in POSTS if title_term in post['title'] or content_term in post['content']]
    return jsonify(matching_posts)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
