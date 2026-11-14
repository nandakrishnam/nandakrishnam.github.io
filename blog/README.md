# How to publish a blog post

1. Copy the `_template` folder and rename the copy to your post's URL, e.g. `idor-in-acme-api`.
   The post will be live at `https://nandakrishnam.github.io/blog/idor-in-acme-api/`.
2. Edit `index.md` in the new folder: change `title`, `date`, `description` and `tags`, then write the post in Markdown.
3. Put any screenshots in the same folder and use `![alt text](file.png)`.
4. Commit and push. The post shows up on `/blog/` and in the homepage writeups list automatically (newest first).

Folders starting with `_` (like `_template`) are never published.
To unpublish a post, delete its folder or rename it to start with `_`.
