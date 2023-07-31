const express = require('express')
const app = express()
const cors = require('cors')
const { getAllThreadsOfAUser, getReplies, postComment, updateComment, deleteComment } = require('./comments.service')
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/comments',(req,res)=>{
    const userName = req.query.userName
    const parentCommentId = req.query.parentCommentId
    if(userName === undefined){
        res.status(400).send("Bad Request. Missing parameter - userName")
    }
    if(parentCommentId === undefined || parentCommentId === null){
        getAllThreadsOfAUser(userName).then((threads)=>{
            res.status(200).send(threads)
        }).catch((err)=>{
            res.status(500).send(err)
        })
    }else{
        getReplies(parentCommentId).then((replies)=>{
            res.status(200).send(replies)
        }).catch((err)=>{
            res.status(500).send(err)
        })
    }
})

app.post('/comments',(req,res)=>{
    const {userName,parentCommentId,commentText} = req.body
    if(userName === undefined || commentText === undefined){
        res.status(400).send("Bad Request. Missing one or more parameters")
    }else{
       postComment(userName,parentCommentId,commentText).then(()=>{
        res.status(200).send("comment posted successfully")
       }).catch((err)=>{
        res.status(500).send(err)
       })
    }
})

app.put('/comments/:commentId',(req,res)=>{
    const commentId = req.params.commentId
    const newText = req.body.newText
    if(newText === undefined){
        res.status(400).send("Bad Request. newText parameter is missing")
    }else{
        updateComment(commentId,newText).then(()=>{
            res.status(200).send("Comment updated successfully")
        }).catch((err)=>{
            res.status(500).send({err:err.message})
        })
    }
})

app.delete('/comments/:commentId',(req,res)=>{
    deleteComment(req.params.commentId).then(()=>{
        res.status(200).send("Comment deleted successfully")
    }).catch((err)=>{
        res.status(500).send(err)
    })
})

const port = process.env.PORT||4000
app.listen(port,()=>{
    console.log("server running...on...",port)
})