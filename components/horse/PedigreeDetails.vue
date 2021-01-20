<template>
	<div class="info-group">
		<div class="info-group__heading">
			<h3 class="py-1">Pedigree</h3>
		</div>
	    
	    <div class="info-group__pedigree">
	    	<div class="row">
	    		<div class="col-6 [ mt-2 ]">
	    			<div class="kvp">
				        <span class="kvp__label">
				            Sire<span class="sr-only">:</span>
				        </span>
				        <span class="kvp__value">
				            {{ lineage.sire }}
				        </span>
				    </div>
	    		</div>
	    		<div class="col-6">
	    			<div class="pedigree-tree__parent">{{ lineage.siresire }}</div>
	                <div class="pedigree-tree__parent">{{ lineage.siredam }}</div>
	    		</div>
	    	</div>
		    
		    <div class="row">
	    		<div class="col-6 [ mt-2 ]">
	    			<div class="kvp">
				        <span class="kvp__label">
				            Dam<span class="sr-only">:</span>
				        </span>
				        <span class="kvp__value">
				            {{ lineage.dam }}
				        </span>
				    </div>
	    		</div>
	    		<div class="col-6">
	    			<div class="pedigree-tree__parent">{{ lineage.damsire }}</div>
	                <div class="pedigree-tree__parent">{{ lineage.damdam }}</div>
	    		</div>
	    	</div>
	    </div>

	    <div class="info-group__btn">
	    	<app-button external block primary :url="lineage.pdf_url">View full pedigree</app-button>
	    </div>
	</div>
</template>

<script>
	export default {
		props: {
			lineage: {
				required: true,
				type: Object
			}
		}
	}
</script>