<template>
    <footer class="site-footer" role="contentinfo">
        <div class="site-footer__container">
            <p class="site-footer__copyright">
                Copyright &copy; {{ (new Date()).getFullYear() }} {{ brandDetails.name }}
            </p>
            <p class="site-footer__credit">
                Crafted by <a href="https://www.jfd.co.uk/" target="_blank">JFD </a> &amp; <a href="https://www.weatherbys.co.uk" target="_blank">Weatherbys</a>
            </p>
        </div>
    </footer>
</template>

<script>
    import { brandDetails } from '~/siteConfig';

    export default {
        created() {
            this.brandDetails = brandDetails;
        }
    }
</script>
