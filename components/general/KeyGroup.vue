<template>
	<div class="info-group">
		<div class="info-group__heading">
			<h3 class="py-1"><slot name="title"></slot></h3>
		</div>
	    
	    <div class="info-group__rows row">
	    	<slot></slot>
	    </div>
	</div>
</template>