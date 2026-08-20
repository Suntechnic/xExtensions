import './dev.css';


export const XDev = {
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            required: true,
        }
    },
    computed: {
        config () {
            return this.$store.state.config;
        },
        show () {
            return this.config?.env?.stage === 'dev';
        }
    },

    template: /* vue-html */`
    <details class="x-dev" v-if="show">
        <summary class="x-dev-title">QR value</summary>
        <div class="x-dev-value">{{ value }}</div>
    </details>
    `
};
