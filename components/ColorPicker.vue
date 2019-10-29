<template>
    <div>
        <!-- <div @click="updateColors">Color Picker</div> -->
        <ul id="example-1">
            <li v-for="(item,i) in colors">
                <div v-bind:style="{backgroundColor: item['hex']}" @click="makeActiveSwatch(i)">Hello {{item['hex']}}</div>                
            </li>
        </ul>
        <sketch-picker v-model="colors[activeSwatch]" @input="updateColors"/>

    </div>
</template>

<script>

import {Sketch} from 'vue-color'

export default {
    components: {
        'sketch-picker': Sketch
    },
    data() {
        return {
            // numberOfColors: 4,
            activeSwatch: 0,
            colors: [{hex: '#ff00ff'},{hex: '#ff0000'}], // the colors as they are created by the color pickers
            convertedColorArray: [] // the colors as they are sent to the ditherer ([0,0,0])
        }
    },
    created() {
        // for(var i = 0; i < this.numberOfColors; i++) {
        //     console.log(i)
        // }
        // this.convertColorToRgbArray()
    },
    methods: {
        makeActiveSwatch(i) {
            this.activeSwatch = i //tells the picker which swatch is being updated
        },
        updateColors(){

            var colorTuplesArray = [];
            this.colors.forEach((v) => {
                colorTuplesArray.push(this.hexToRgb(v['hex']))
            })
            console.log(colorTuplesArray)
            this.$emit('update-colors', colorTuplesArray)
            
        },
        hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : null;
        }        
     
    }
}
</script>