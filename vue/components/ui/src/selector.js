import './selector.css';

export const Selector = {
    inject: ['ioptions'],
    name: 'Selector',
    emits: ['update:modelValue'],
    props: {
        options: {},
        valuekey: {}, // ключ значения в объекте option списка options - если не указан - то ключ в options
        titlekey: {}, // ключ title
        name: {}, // имя поля
        placeholder: { default: '' },

        multiselect: { default: false },

        view_search: { default: true },
        view_reset: { default: true },

        modelValue: {},
    },
    data() {
        return {
            insideValue: [],
            state: {
                search: '',
                open: false
            }
        }
    },
    created() {
        this.modelValue2insideValue();
    },
    watch: {
        insideValue(val, oval) {
            if (JSON.stringify(val) == JSON.stringify(oval)) return;
            let Value4ebmit;
            if (this.multiselect) {
                Value4ebmit = JSON.parse(JSON.stringify(this.insideValue));
            } else {
                if (this.insideValue?.length == 1) {
                    Value4ebmit = this.insideValue[0];
                } else {
                    Value4ebmit = undefined;
                }
            }
            if (JSON.stringify(Value4ebmit) != JSON.stringify(this.modelValue)) 
                    this.$emit('update:modelValue', Value4ebmit);
        },
        modelValue(val, oval) {
            this.modelValue2insideValue();
        }
    },
    computed: {
        structure() {
            let structure = {
                options: [],
                map: {}
            };

            let options = this.options || this.ioptions;

            for (let i in options) {
                let option = {
                    value: this.valuekey ? options[i][this.valuekey] : i,
                    title: this.titlekey ? options[i][this.titlekey] : options[i],
                    //option: this.options[i]
                }
                option.searcheble = option.title.toLowerCase();
                structure.map[option.value] = structure.options.length;
                structure.options.push(option);
            }

            return structure;
        },
        indexeselected() {
            let indexeselected = [];
            if (this.structure.map) {
                for (let i in this.insideValue) {
                    if (typeof this.structure.map[this.insideValue[i]] != 'undefined')
                            indexeselected.push(this.structure.map[this.insideValue[i]]);
                }
                return indexeselected;
            }
        },
        optionselected() {
            let optionselected = [];
            if (this.structure.options?.length && typeof this.indexeselected != 'undefined') {
                for (let i in this.indexeselected) {
                    let index = this.indexeselected[i];

                    optionselected.push(this.structure.options[index]);
                }
            }
            return optionselected;
        },
        titles() {
            let titles = [];
            for (let i in this.optionselected) {
                let option = this.optionselected[i];
                titles.push(option.title);
            }

            if (!titles.length && this.placeholder) titles.push(this.placeholder);

            return titles;
        },
        orderedOptions() {
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
        modelValue2insideValue() {
            let insideValueNew = [];
            if (typeof this.modelValue == 'undefined' || this.modelValue == null || !this.modelValue) {
                insideValueNew = [];
            } else if (typeof this.modelValue == 'object') {
                insideValueNew = JSON.parse(JSON.stringify(this.modelValue))
            } else if (typeof this.modelValue != 'object') {
                insideValueNew = [this.modelValue];
            }
            if (JSON.stringify(this.insideValue) != JSON.stringify(insideValueNew)) 
                    this.insideValue = insideValueNew;
        },
        open() {
            this.state.open = true;
        },
        close() {
            this.state.open = false;
        },
        toggle() {
            this.state.open = !this.state.open;
        },
        set(value) {
            if (this.multiselect) {
                for (let i in this.insideValue) {
                    let oneVal = this.insideValue[i];
                    if (oneVal == value) {
                        this.insideValue.splice(i, 1);
                        return;
                    }
                }
                this.insideValue.push(value);
            } else {
                this.insideValue = [value];
                this.close();
            }
        }
    },
    template: /*vue-html*/`
    <div class="selector">
        <input
                v-if="name"
                v-bind:name="name"
                v-bind:value="insideValue"
                type="hidden"
            >
        <div class="selector-display" v-on:click="toggle">{{titles.join(', ')}}</div>
        <div class="selector-list" v-if="state.open">
            <input v-if="view_search" v-model="state.search">
            <span class="selector-unselect" v-if="view_reset && optionselected.length" v-on:click="set('')">Сбросить значение ❌</span>
            <ul>
                <li
                        v-for="option in orderedOptions[0]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:(insideValue && typeof insideValue == 'object' && insideValue.includes(option.value))}"
                    >{{option.title}}</li>
                <li
                        v-for="option in orderedOptions[1]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:(insideValue && typeof insideValue == 'object' && insideValue.includes(option.value))}"
                        class="selector-list-item_others"
                    >{{option.title}}</li>
                <li
                        v-for="option in orderedOptions[2]"
                        v-bind:key="'o_'+option.value"
                        v-on:click="set(option.value)"
                        v-bind:class="{active:(insideValue && typeof insideValue == 'object' && insideValue.includes(option.value))}"
                        class="selector-list-item_rest"
                    >{{option.title}}</li>
            </ul>
        </div>
    </div>
	`
}