export default function(context) {
    if(!context.store.getters['auth/isAuthenticated']) {
        if(context.route.path !== '/password' || context.route.path !== '/register') {
            context.redirect('/');
        }
    } else if(context.route.path === '/' || context.route.path === '/password' || context.route.path === '/register') {
        context.redirect('/horses');
    }
}
