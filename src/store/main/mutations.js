let mutations = {
    loginSuccess (state, user) {
        state.loggedIn = true
        state.user = user
    },
    loginFailure (state) {
        state.loggedIn = false
        state.user = null
    },
    logout (state) {
        state.loggedIn = false
        state.user = null
    },
    toggleSideBar (state) {
        state.sideBarOpen = !state.sideBarOpen
    }
};

export default mutations;