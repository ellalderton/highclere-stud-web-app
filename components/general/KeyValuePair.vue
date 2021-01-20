<template>
	<div class="col-6 col-sm-4 col-md-6 col-lg-3">
		<div class="kvp">
	        <span class="kvp__label">
	            <slot name="label"></slot><span class="sr-only">:</span>
	        </span>
	        <span class="kvp__value">
	            <slot/>
	        </span>
	    </div>
	</div>
</template>