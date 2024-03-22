import Vuex from 'vuex'


const state = {
    dentist: null
};

const store = new Vuex.Store({
    state,
    getters: {
        dentist: (state) => {
            return state.dentist;
        }
    },
    actions: {
        dentist({commit}, dentist) {
            
            commit('SET_DENTIST', dentist)
            commit('dentist', dentist)
        }
    },
    mutations: {
        dentist(state, dentist) {
            state.dentist = dentist;
        },
        SET_DENTIST(state, dentist) {
            state.dentist = dentist
          },
       
    }
})

export default store;
