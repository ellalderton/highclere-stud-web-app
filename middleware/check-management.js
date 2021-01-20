export default function(context) {
	if(!context.store.getters['auth/isManagement']) {		
		context.redirect('/entries');			
	}
}