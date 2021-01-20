<template>
	<div class="auth">
    <div class="auth__container">
		  <nuxt/>	
		</div>
	</div>
</template>

<style>
	.page-enter-active, .page-leave-active {
      transition: all .30s ease-out;
    }
    .page-enter, .page-leave-active {
      opacity: 0;
      transform-origin: 50% 50%;
    }
</style>