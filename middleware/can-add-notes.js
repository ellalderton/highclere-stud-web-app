export default function(context) {
	if(!context.store.getters['auth/getCanAddNotes']) {		
		context.redirect('/entries');			
	} 
}