const user = localStorage.getItem('user')

let state = {
    loggedIn: user ? true : false,
    user: user ? user : null,
    sideBarOpen: false
};

export default state;