import {Input} from 'x.vue.mixins';
import './toggler.css';

export const Toggler = {
	mixins: [Input],
	props: {
		value1: {
            type: String
        },
        value2: {
            type: String
        },
		title1: {
            type: String,
			default: ''
        },
        title2: {
            type: String,
			default: ''
        },
        name: {
            type: String,
			default: ''
        }
	},
    data () {
        return {
            
        }
    },
    methods: {
        toggle (val)
        {
			if (val == this.value1 || val == this.value2) {
                this.valueModel = val;
            } else if (this.valueModel == this.value1) {
                this.valueModel = this.value2;
            } else {
                this.valueModel = this.value1;
            }
        }
    },
	template: `
    <div 
            class="toggler"
            v-bind:class="{'alt_value':valueModel==value2}"
        >
        <input
                v-if="name"
                v-bind:name="name"
                v-bind:value="valueModel"
                type="hidden"
            >
        <span class="toggler_label" 
                v-bind:class="{'toggler_active_value':valueModel==value1}" 
                v-on:click="toggle('CollectionsList')"
            >{{title1}}</span>
        <div class="toggler_switch" v-on:click="toggle">
            <span class="toggler_switch_slider"></span>
        </div>
        <span class="toggler_label"
                v-bind:class="{'toggler_active_value':valueModel==value2}" 
                v-on:click="toggle('TilesList')"
            >{{title2}}</span>
    </div>
	`
}
