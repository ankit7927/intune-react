import { createSlice } from "@reduxjs/toolkit"
import { getFriends } from "./friendsReducer"


const initialState = {
    friends: {
        friends: [],
        incoming: [],
        outgoing: []
    },
    error: null,
    status: 'idle'
}

const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        incomingRequest: (state, action) => {
            state.friends.incoming.push(action.payload)
        },

        canceledIncomingRequest: (state, action) => {
            const creq = action.payload;
            state.friends.incoming = state.friends.incoming.filter(req => creq._id !== req._id)
        },

        requestSent: (state, action) => {
            state.friends.outgoing.push(action.payload)
        },

        cancelSentRequest: (state, action) => {
            const creq = action.payload;
            state.friends.outgoing = state.friends.outgoing.filter(req => creq._id !== req._id)
        },

        rejectRequest: (state, action) => {
            const rreq = action.payload;
            state.friends.incoming = state.friends.incoming.filter(req => rreq._id !== req._id)
        },

        requestRejected: (state, action) => {
            const rreq = action.payload;
            state.friends.outgoing = state.friends.outgoing.filter(req => rreq._id !== req._id)
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getFriends.pending, (state) => {
                state.status = 'loading'
            })

            .addCase(getFriends.rejected, (state, action) => {
                state.status = 'idle',
                    state.error = action.error.message
            })

            .addCase(getFriends.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.friends = action.payload.data.friends
            })
    }
})

export const { incomingRequest, canceledIncomingRequest, requestSent, 
    cancelSentRequest, rejectRequest, requestRejected } = friendsSlice.actions
export default friendsSlice.reducer;