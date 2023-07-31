# testAssignment
# Database design for comments system
## Tables - 
# 1. comments(comment_id(PK,AI),comment_data(varchar),user_name(varchar),has_reply(bool),is_thread_start(bool),timestamp(timestamp))
# 2. replies(parent_comment_id(fk),child_comment_id(fk))

# user management, authentication and authorisation has not been done as it was not clear in the assignment.

# APIs (https://lightmetrics-comments-assignment.onrender.com)
# 1. GET(/comments) - Query params - (userName*,parentCommentId) - returns comments of the user or replies to a comment incase parent comment id is provided.
# 2. POST(/comments) - Body - (parentCommentId,userName*,commentText*) - writes the comment to db as a thread start if parent comment id is not provided else will write the comment as a reply to the provided parent comment id.
# 3. PUT(/comments/:commentId) - Body - (newText*) - updates the given comment with the new text.
# 4. DELETE(/comments/:commentId) - will delete the given comment 