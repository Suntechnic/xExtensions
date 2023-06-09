import {Input} from 'x.vue.mixins';
import './selector.css';

export const Selector = {
    inject: ['ioptions'],
    mixins: [Input],
    name: 'Selector',
    props: {
        options: {},
        valuekey: {}, // ключ значения в объекте option списка options - если не указан - то ключ в options
        titlekey: {}, // ключ title
        name: {}, // имя поля
        placeholder: {default: ''},

        multiselect: {default: false},
        
        view_search: {default: true},
        view_reset: {default: true}
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
    created ()
	{
		this.modelValue2valueModel();
	},
    watch: {
		valueModel (val,oval)
        {
            if (this.multiselect) {
                this.$emit('update:modelValue', this.valueModel);
            } else {
                if (this.valueModel?.length == 1) {
                    this.$emit('update:modelValue', this.valueModel[0]);
                } else {
                    this.$emit('update:modelValue', undefined);
                }
            }
        },
        modelValue (val,oval)
        {
            this.modelValue2valueModel();
        }
	},
    computed: {
        structure () {
            let structure = {
                options: [],
                map: {}
            };

            let options = this.options || this.ioptions;
            
            for (let i in options) {
                let option = {
                    value: this.valuekey?options[i][this.valuekey]:i,
                    title: this.titlekey?options[i][this.titlekey]:options[i],
                    //option: this.options[i]
                }
                option.searcheble = option.title.toLowerCase();
                structure.map[option.value] = structure.options.length;
                structure.options.push(option);
            }
            
            return structure;
        },
        indexeselected () {
            let indexeselected = [];
            if (this.structure.map) {
                for (let i in this.valueModel) {
                    indexeselected.push(this.structure.map[this.valueModel[i]]);
                }
                //console.log(JSON.stringify(indexeselected));
                return indexeselected;
            }
        },
        optionselected () {
            let optionselected = [];
            if (this.structure.options?.length && typeof this.indexeselected != 'undefined') {
                for (let i in this.indexeselected) {
                    let index = this.indexeselected[i];

                    optionselected.push(this.structure.options[index]);
                }
            }
            return optionselected;
        },
        titles () {
            let titles = [];
            for (let i in this.optionselected) {
                let option = this.optionselected[i];
                titles.push(option.title);
            }

            if (!titles.length && this.placeholder) titles.push(this.placeholder);
            
            return titles;
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
        modelValue2valueModel () {
            this.valueModel = this.modelValue;

            if (typeof this.valueModel == 'undefined' || this.valueModel == null || !this.valueModel) {
                this.valueModel = [];
            } else if (typeof this.valueModel != 'object') {
                this.valueModel = [this.valueModel];
            }

            //console.log('valueModel',this.valueModel);
        },
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
            if (this.multiselect) {
                for (let i in this.valueModel) {
                    let oneVal = this.valueModel[i];
                    if (oneVal == value) {
                        this.valueModel.splice(i,1);
                        return;
                    }
                }
                this.valueModel.push(value);
            } else {
                this.valueModel = [value];
                this.close();
            }
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
        <div class="selector-display" v-on:click="toggle">{{titles.join(', ')}}</div>
        <div class="selector-list" v-if="state.open">
            <input v-if="view_search" v-model="state.search">
            <span class="selector-unselect" v-if="view_reset && option" v-on:click="set('')">Сбросить значение ❌</span>
            <ul>
                <li
                        v-for="option in orderedOptions[0]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:valueModel.includes(option.value)}"
                    >{{option.title}}</li>
                <li
                        v-for="option in orderedOptions[1]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:valueModel.includes(option.value)}"
                        class="selector-list-item_others"
                    >{{option.title}}</li>
                <li
                        v-for="option in orderedOptions[2]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:valueModel.includes(option.value)}"
                        class="selector-list-item_rest"
                    >{{option.title}}</li>
            </ul>
        </div>
    </div>
	`
}