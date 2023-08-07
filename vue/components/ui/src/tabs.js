/*
<div vue="Tabs" data-classprefix="mytabs-">
    <script type="extension/settings" name="tabslist"><?=json_encode([
            ['slot'=>'tab1','name'=>'Таб 1'],
            ['slot'=>'tab2','name'=>'Таб 2']
        ]);?></script>
    <div vue-slot="content-tab1">Содержимое 1</div>
    <div vue-slot="content-tab2">Содержимое 2</div>
</div>
*/
export const Tabs = {
	inject: ['tabslist'],
    props: {
        classprefix: {default:''},
        event: {
            type: String,
			default: ''
        },
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
    watch: {
		slot (val,oval)
        {
			if (this.event) {
                if (BX?.onCustomEvent) BX.onCustomEvent(
                            'x.vue.components.ui:Tabs:'+this.event, 
                            {value: this.slot}
                        );
            }
        }
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
