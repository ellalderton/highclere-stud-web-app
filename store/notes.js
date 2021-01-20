import axios from 'axios';

export const state = () => ({
  authors: [],
  filters: {
    owner: null,
    author: null,
    from: null,
    to: null,
    open: false,
  },
  pagination: {
    horses: 1,
  }
});

export const mutations = {
  setAuthors(state, data) {
    state.authors = data;
  },
  setFilters(state, filters) {
    state.filters = filters;
  },
  clearFilters(state) {
    state.filters = {
      owner: null,
      author: null,
      from: null,
      to: null,
      open: false,
    }
  },
  setHorsesPagination(state, page) {
    state.pagination.horses = page;
  },
  resetPagination(state) {
    state.pagination.horses = 1;
  }
}

export const actions = {
  getNote(vuexContext, id) {
    const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/${id}/webapp`;

    return this.$axios
      .$get(getUrl)
      .then(result => {
        return result.data;
      })
      .catch(e => Promise.reject(e));
  },
  getReplies(vuexContext, id) {
    const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/${id}/replies-app?include=replies`;

    return this.$axios
      .$get(getUrl)
      .then(result => {
        const totalPages = result.meta.last_page;

        if (totalPages === 1) return result.data;

        let postArray = [];

        for (let i = 2; i <= totalPages; i++) {
          postArray.push(this.$axios.$get(`${getUrl}&page=${i}`));
        }

        return axios.all(postArray)
          .then(axios.spread((...res) => {
            for (let i = 0; i < res.length; i++) {
              result.data = result.data.concat(res[i].data);
            }

            return result.data;
          }))

      })
      .catch(e => Promise.reject(e));
  },
  markAsRead(vuexContext, id) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/${id}/read`;

    return this.$axios
      .$post(postUrl)
      .then(result => {
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  markAsUnread(vuexContext, id) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/${id}/unread`;

    return this.$axios
      .$post(postUrl)
      .then(result => {
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  markAllOfNoteAsRead(vuexContext, id) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/${id}/all-read`;

    return this.$axios
      .$post(postUrl)
      .then(result => {
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  markAllAsRead(vuexContext) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/all-read`;

    return this.$axios
      .$post(postUrl)
      .then(result => {
        // set unread notes all to 0;
        vuexContext.commit('horses/markAllNotesAsRead', 0, { root: true });
        vuexContext.commit('auth/setUnreadNotes', 0, { root: true });
        vuexContext.commit('auth/setUnreadComments', 0, { root: true });
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  getNotes(vuexContext, { pagination, filters }) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/orderedByUnreadSyndicate?page=${pagination}`;

    return this.$axios
      .$post(postUrl, filters)
      .then(result => {
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  getOrderedNotes(vuexContext, { pagination, filters }) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/orderedByUnread?page=${pagination}`;

    return this.$axios
      .$post(postUrl, filters)
      .then(result => {
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  orderedByUnreadBs(vuexContext, { pagination, filters }) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/orderedByUnreadBs?page=${pagination}`;

    return this.$axios
      .$post(postUrl, filters)
      .then(result => {
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  orderedByUnreadHit(vuexContext, { pagination, filters }) {
    const postUrl = `${process.client ? window.location.origin : ''}/w-api/api/notes/orderedByUnreadHit?page=${pagination}`;

    return this.$axios
      .$post(postUrl, filters)
      .then(result => {
        return result;
      })
      .catch(e => Promise.reject(e));
  },
  getAuthors(vuexContext) {
    if (vuexContext.getters.getAuthors) return vuexContext.getters.getAuthors;

    const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/users/all`;

    return this.$axios
      .$get(getUrl)
      .then(result => {
        vuexContext.commit('setAuthors', result.data);

        return result.data;
      })
      .catch(e => Promise.reject(e));
  }
}

export const getters = {
  getAuthors(state) {
    if (!state.authors.length) return;

    return state.authors;
  },
  getFilters: (state) => () => {
    return state.filters;
  },
  getHorsesPagination(state) {
    return state.pagination.horses
  }
}
