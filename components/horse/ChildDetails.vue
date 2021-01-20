<template>
	<key-group>
		<template slot="title">Current {{ type }}</template>

        <key-value-pair>
    		<template slot="label">Colouring</template>
    		{{ child.color }}
    	</key-value-pair>

        <key-value-pair>
    		<template slot="label">Sex</template>
    		{{ child.sex }}
    	</key-value-pair>

        <key-value-pair>
    		<template slot="label">Sire</template>
    		{{ child.sire }}
    	</key-value-pair>

        <key-value-pair>
    		<template slot="label">Date of birth</template>
    		{{ child.date_of_birth | hypensToSlashesDate }}
    	</key-value-pair>
	</key-group>
</template>

<script>
	export default {
		props: {
			child: {
				required: true,
				type: Object
			},
			type: {
				required: true,
				type: String
			}
		}		
	}
</script>