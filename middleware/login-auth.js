// if already logged in redirect if try to access login page
export default function(context) {
    if(context.store.getters['auth/isAuthenticated']) {
        context.redirect('/horses');
    }
}
