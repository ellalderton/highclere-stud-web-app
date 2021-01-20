<template>
    <div>
    	<key-group>
    		<template slot="title">Profile</template>
                        
        	<key-value-pair>
        		<template slot="label">Age</template>
        		{{ horse.age }} ({{ horse.date_of_birth | formattedDate }})
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Sire</template>
        		{{ horse.lineage.sire }}
        	</key-value-pair>
            
            <key-value-pair>
        		<template slot="label">Dam</template>
        		{{ horse.lineage.dam }}
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Dam's Sire</template>
        		{{ horse.lineage.damsire }}
        	</key-value-pair>

            <key-value-pair>
                <template slot="label">Colour</template>
                {{ horse.primary_color.name }}
            </key-value-pair>

            <key-value-pair>
                <template slot="label">Sex</template>
                {{ horse.sex.name | capitalize }}
            </key-value-pair>

            <key-value-pair>
                <template slot="label">Trainer</template>
                {{ horseTrainer }}
            </key-value-pair>

            <key-value-pair>
                <template slot="label">Type</template>
                {{ horse.horse_type.name }}
            </key-value-pair>

            <key-value-pair>
        		<template slot="label">Location</template>
        		{{ horse.current_location | naIfEmpty }}
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Ownership</template>
        		{{ horse.ownership ? horse.ownership.name : 'n/a' }}
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Purchase price</template>
        		{{ purchasedPrice }}
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Sale name</template>
        		{{ saleName }}
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Breeder</template>
        		{{ horse.breeder | naIfEmpty }}
        	</key-value-pair>
            
            <key-value-pair>
        		<template slot="label">Rating</template>
        		{{ horse.bha_rating | naIfEmpty }}
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Grouping</template>
        		{{ horse.group.name }}
        	</key-value-pair>
    	</key-group>
        <div class="info-group__btn">
            <app-button external block primary :url="horse.lineage.pdf_url">View full pedigree</app-button>
        </div>
    </div>
</template>

<script>
	import horseTrainerMixin from '@/mixins/horseTrainerMixin.js';

	export default {
		mixins: [horseTrainerMixin],
		props: {
			horse: {
				required: true,
				type: Object
			}
		},
		computed: {
			purchasedPrice() {
				if(!this.horse.sales[0]) return 'n/a';

				return `${this.horse.sales[0].price} ${this.horse.sales[0].currency}`;
			},
			saleName() {
				if(!this.horse.sales[0]) return 'n/a';

				return this.horse.sales[0].name;
			}
		}
	}
</script>