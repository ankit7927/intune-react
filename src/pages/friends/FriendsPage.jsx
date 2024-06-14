import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import socket from '../../services/socketService'
import { getFriends } from '../../redux/friends/friendsReducer'
import { cancelSentRequest, requestSent } from '../../redux/friends/friendsSlice'



const FriendsPage = () => {
    const dispatch = useDispatch()
    const [refresh, setrefresh] = useState(false)
    const [username, setusername] = useState("")

    const myId = useSelector(state => state.auth.userId)
    const friends = useSelector(state => state.friends.friends)

    useEffect(() => {
        if (refresh) {
            dispatch(getFriends())
        }

        setrefresh(false)
    }, [refresh])

    const handleRequest = (e) => {
        e.preventDefault()
        socket.emit("send-request", { to: username, from: myId }, (val) => { dispatch(requestSent(val)) })
        setusername("")
    }

    const handleRequestCancel = (requ) => {
        socket.emit("cancel-request", { to: requ.userId, from: myId }, (val) => { dispatch(cancelSentRequest(requ)) })
    }

    const handleRequestReject = (requ) => {

    }

    const handleRequestAccept = (requ) => {

    }

    return (
        <div>
            <Link to="/home">Home</Link>
            <h1>friends</h1>
            <form onSubmit={handleRequest}>
                <input type="text" placeholder="username" required value={username} onChange={e => { setusername(e.target.value) }} />
                <input type="submit" value="send" />
            </form>
            <br />
            <button onClick={() => { setrefresh(true) }}>refresh</button>
            <div>
                <h5>frinds</h5>
                {
                    friends?.friends?.map(ele => {
                        return <p>{ele.name}</p>
                    })
                }
            </div>
            <div>
                <h5>incoming</h5>
                {
                    friends?.incoming?.map(ele => {
                        return <p>{ele.name} <button onClick={() => { handleRequestReject(ele) }}>reject</button> <button onClick={() => { handleRequestAccept(ele) }}>accept</button></p>
                    })
                }
            </div>
            <div>
                <h5>outgoing </h5>
                {
                    friends?.outgoing?.map(ele => {
                        return <p>{ele.name} <button onClick={() => { handleRequestCancel(ele) }}>cancel</button></p>
                    })
                }
            </div>
        </div>
    )
}

export default FriendsPage