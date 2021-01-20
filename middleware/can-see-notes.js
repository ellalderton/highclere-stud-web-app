export default function(context) {
	if(!context.store.getters['auth/getCanSeeNotes']) {		
		context.redirect('/entries');			
	} 
}