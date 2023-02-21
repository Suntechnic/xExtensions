import {Input} from 'x.vue.mixins';
import './selector.css';

export const Selector = {
    mixins: [Input],
    name: 'Selector',
    props: {
        options: {},
        valuekey: {},
        titlekey: {},
        name: {},
        placeholder: {default: ''}
    },
    data ()
	{
		return {
			state: {
                search: '',
                open: false
            }
		}
	},
    computed: {
        structure () {
            let structure = {
                options: [],
                map: {}
            };
            
            for (let i in this.options) {
                let option = {
                    value: this.valuekey?this.options[i][this.valuekey]:i,
                    title: this.titlekey?this.options[i][this.titlekey]:this.options[i],
                    //option: this.options[i]
                }
                option.searcheble = option.title.toLowerCase();
                structure.map[option.value] = structure.options.length;
                structure.options.push(option);
            }
            
            return structure;
        },
        index () {
            if (this.structure.map) return this.structure.map[this.valueModel];
        },
        option () {
            if (this.structure.options?.length && typeof this.index != 'undefined') return this.structure.options[this.index]
        },
        title () {
            if (this.option) return this.option.title;
            return this.placeholder;
        },
        orderedOptions () {
            let ordered = [
                [],
                [],
                []
            ];
            
            if (this.state.search) {
                let search = this.state.search.toLowerCase();
                for (let i in this.structure.options) {
                    let option = this.structure.options[i];
                    let pos = option.searcheble.indexOf(search)
                    if (pos == 0) {
                        ordered[0].push(option);
                    } else if (pos > 0) {
                        ordered[1].push(option);
                    } else {
                        ordered[2].push(option);
                    }
                }
            } else {
                ordered[0] = this.structure.options;
            }
            
            return ordered;
        }
    },
    methods: {
        open ()
        {
            this.state.open = true;
        },
        close ()
        {
            this.state.open = false;
        },
        toggle ()
        {
            this.state.open = !this.state.open;
        },
        set (value)
        {
            this.valueModel = value;
            this.close();
        }
    },
	template: `
    <div class="selector">
        <input
                v-if="name"
                v-bind:name="name"
                v-bind:value="valueModel"
                type="hidden"
            >
        <div class="selector-display" v-on:click="toggle">{{title}}</div>
        <div class="selector-list" v-if="state.open">
            <input v-model="state.search">
            <span class="selector-unselect" v-if="option" v-on:click="set('')">Сбросить значение ❌</span>
            <ul>
                <li
                        v-for="option in orderedOptions[0]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:valueModel==option.value}"
                    >{{option.title}}</li>
                <li
                        v-for="option in orderedOptions[1]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:valueModel==option.value}"
                        class="selector-list-item_others"
                    >{{option.title}}</li>
                <li
                        v-for="option in orderedOptions[2]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:valueModel==option.value}"
                        class="selector-list-item_rest"
                    >{{option.title}}</li>
            </ul>
        </div>
    </div>
	`
}