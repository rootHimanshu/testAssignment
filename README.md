# testAssignment
# Database design for comments system
## Tables - 
# 1. comments(comment_id(PK,AI),comment_data(varchar),user_name(varchar),has_reply(bool),is_thread_start(bool),timestamp(timestamp))
# 2. replies(parent_comment_id(fk),child_comment_id(fk))

# user management, authentication and authorisation has not been done as it was not clear in the assignment.