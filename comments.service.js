const mysql = require('mysql2')
const { establishConnection } = require("./db_connection")

/*
* This function is for getting all the parent level or start comments of a person as per person's username 
*/
const getAllThreadsOfAUser = (userName)=>{
    return new Promise((resolve,reject)=>{
        establishConnection().then((connection)=>{
            connection.query(`SELECT * FROM comments WHERE user_name=${mysql.escape(userName)} AND is_thread_start=1 ORDER BY timestamp DESC`,(err,result)=>{
                if(err){
                    console.log(err)
                    connection.release()
                    reject(err)
                }
                connection.release()
                resolve(result)
            })
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
}

const getReplyIdsInQueryFormat = (replies)=>{
    let replyIds = "("
    replies.forEach((reply,index)=>{
        if(index<replies.length-1){
            replyIds+=reply.child_comment_id+","
        }else{
            replyIds+=reply.child_comment_id+")"
        }
    })
    return replyIds
}

/*
* This function is used for getting the child level comments that is replies when clicked on functionality like view replies
* This receives parent comment's id as a parameter and return all the first level replies of that comment 
*/
const getReplies = (parentCommentId)=>{
    return new Promise((resolve,reject)=>{
        establishConnection().then((connection)=>{
            connection.query(`SELECT child_comment_id FROM replies WHERE parent_comment_id=${parentCommentId}`,(err,result)=>{
                if(err){
                    console.log(err)
                    connection.release()
                    reject(err)
                }
                if(result === null || result.length<1){
                    connection.release()
                    resolve([])
                }else{
                    connection.query(`SELECT * FROM comments WHERE comment_id IN ${getReplyIdsInQueryFormat(result)} ORDER BY timestamp DESC`,(ferr,fres)=>{
                        if(ferr){
                            console.log(ferr)
                            connection.release()
                            reject(ferr)
                        }
                        connection.release()
                        resolve(fres)
                    })
                }
            })
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
}

/**This function is used to post a new comment. If the parent comment id is null 
 * then the comment is inserted as a thread start else it is inserted as a reply 
 * to the given parent comment */
const postComment = (userName, parentCommentId,commentText)=>{
    return new Promise((resolve,reject)=>{
        if(parentCommentId === null || parentCommentId === undefined){
            establishConnection().then((connection)=>{
                connection.query(`INSERT INTO comments (comment_data,user_name,has_reply,is_thread_start) VALUES ('${commentText}','${userName}',0,1)`,(err,result)=>{
                    if(err){
                        console.log(err)
                        connection.release()
                        reject(err)
                    }
                    connection.release()
                    resolve()
                })
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        }else{
            establishConnection().then((connection)=>{
                isCommentExists(parentCommentId,connection).then((isComExists)=>{
                    if(isComExists){
                        connection.query(`INSERT INTO comments (comment_data,user_name,has_reply,is_thread_start) VALUES ('${commentText}','${userName}',0,0)`,(err,result)=>{
                            if(err){
                                console.log(err)
                                connection.release()
                                reject(err)
                            }
                            console.log(result)
                            connection.query(`INSERT INTO replies VALUES ('${parentCommentId}','${result.insertId}')`,(rerr,rresult)=>{
                                if(rerr){
                                    console.log(rerr)
                                    connection.release()
                                    reject(rerr)
                                }
                                connection.query(`UPDATE comments SET has_reply=1 WHERE comment_id=${parentCommentId}`,(ferr,fres)=>{
                                    if(ferr){
                                        console.log(ferr)
                                        connection.release()
                                        reject(ferr)
                                    }
                                    connection.release()
                                    resolve()
                                })
                            })
                        })
                    }else{
                        connection.release()
                        reject(new Error("Provided parent comment id does not exist"))
                    }
                }).catch((err)=>{
                    connection.release()
                    reject(err)
                })
            }).catch((err)=>{
                console.log(err)
                reject(err)
            })
        }
    })
}

/** This function is used to update a comment */
const updateComment = (commentId,newText)=>{
    return new Promise((resolve,reject)=>{
        establishConnection().then((connection)=>{
            isCommentExists(commentId,connection).then((isExists)=>{
                if(isExists){
                    connection.query(`UPDATE comments SET comment_data='${newText}' WHERE comment_id=${commentId}`,(err,res)=>{
                        if(err){
                            console.log(err)
                            connection.release()
                            reject(err)
                        }
                        connection.release()
                        resolve()
                    })
                }else{
                    connection.release()
                    reject(new Error("Provided comment id does not exist"))
                }
            }).catch((err)=>{
                connection.release()
                reject(err)
            })
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
}

/** This function deletes the given comment from the db
 * Currently all it's replies are not deleted from the db
 * But since the parent comment is deleted, these replies will
 * not be included in any way while getting the comments of the user
 * since there is no parent reference remaining to these replies 
 */
const deleteComment = (commentId)=>{
    return new Promise((resolve,reject)=>{
        establishConnection().then((connection)=>{
            connection.query(`DELETE FROM comments WHERE comment_id=${commentId}`,(err,res)=>{
                if(err){
                    console.log(err)
                    connection.release()
                    reject(err)
                }
                connection.release()
                resolve()
            })
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
}

const isCommentExists = (commentId,connection)=>{
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * from comments WHERE comment_id=${commentId}`,(err,res)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            if(res!==undefined && res.length>0){
                resolve(true)
            }
            resolve(false)
        })
    })
}
// updateComment(10,"This is first comment !!!").then(()=>{
//     console.log("updated successfully")
// }).catch((err)=>{
//     console.log(err)
// })
// postComment('Jean',5,'This is first reply to second reply of the comment').then((res)=>{
//     console.log("comment posted")
// }).catch((err)=>{
//     console.log("posting comment failed")
// })
// getAllThreadsOfAUser('Himanshu').then((res)=>{
//     console.log(res)
// }).catch((err)=>{
//     console.log(err)
// })
// getReplies(10).then((res)=>{
//     console.log(res)
// }).catch((err)=>{
//     console.log(err)
// })
// deleteComment(10).then((res)=>{
//     console.log("deleted")
// }).catch((err)=>{
//     console.log(err)
// })
module.exports={getAllThreadsOfAUser,getReplies,postComment,updateComment,deleteComment}