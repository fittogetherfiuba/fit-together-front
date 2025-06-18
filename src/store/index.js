import Vuex from "vuex";
import main from "./main";
import notifications from "./main/notifications";

export default new Vuex.Store({
    modules: {
        main,
        notifications
    },
});