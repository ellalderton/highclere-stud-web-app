<template>
	<div class="panel panel--has-bg-image" style="background-image: url('/images/panel-bg.jpg')">
        <div class="[ panel__body ] [ flow-vertical--2 ]">
            <h3 class="heading--3 heading--white"><slot name="title"></slot></h3>
            <slot></slot>
        </div>
    </div>
</template>