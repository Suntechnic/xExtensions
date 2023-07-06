export const Tabs = {
	inject: ['tabslist'],
    props: {
        classprefix: {default:''},
    },
    data () {
        return {
            tabs: this.tabslist,
            slot: false
        }
    },
    created () {
        this.slot=this.tabs[0].slot;
    },
    methods: {
        set (name)
        {
			this.slot=name;
        }
    },
	template: `
    <div v-bind:class="classprefix+'tabs'">
        <ul v-bind:class="classprefix+'tabs_labels'">
            <li 
                    v-for="tab in tabs" 
                    v-bind:class="classprefix+'tabs_labels_item'+(slot==tab.slot?'active':'')"
                    v-on:click="set(tab.slot)"
                >
                {{tab.name}}
            </li>
        </ul>

        

        <slot v-if="slot" v-bind:name="'content-'+slot"></slot>
    </div>
	`
}
