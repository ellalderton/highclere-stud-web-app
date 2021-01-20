<template>
	<key-group>
		<template slot="title">Pregnancy Details</template>

        <template v-if="horse.pregnancy_status">
            <key-value-pair>
        		<template slot="label">Status</template>
        		{{ horse.pregnancy_status.name }}
        	</key-value-pair>

            <key-value-pair>
        		<template slot="label">Covering</template>
        		{{ horse.pregnancy_covering }}
        	</key-value-pair>

            <key-value-pair v-if="horse.pregnancy_last_service_date">
        		<template slot="label">Last Service Date</template>
        		{{ horse.pregnancy_last_service_date | formattedDate }}
        	</key-value-pair>

            <key-value-pair v-if="horse.pregnancy_due_date">
        		<template slot="label">Due Date</template>
        		{{ horse.pregnancy_due_date | formattedDate }}
        	</key-value-pair>

            <key-value-pair v-if="horse.pregnancy_sex">
        		<template slot="label">Sex</template>
        		{{ horse.pregnancy_sex.gender }}
        	</key-value-pair>
        </template>

        <key-value-pair v-if="horse.next_seasons_mating">
            <template slot="label">Next season's mating</template>
            {{ horse.next_seasons_mating }}
        </key-value-pair>

	</key-group>      
</template>

<script>
	export default {
		props: {
			horse: {
				required: true,
				type: Object
			}
		}
	}
</script>