<template>
    <div class="border-solid border-2 max-w-md border-gray-600">
        <!-- <div @click="updateColors">Color Picker</div> -->
        <ul class="flex flex-wrap">
            <li v-for="(item,i) in palette">
                <div class="w-10 h-10 m-1" v-bind:style="{backgroundColor: item['hex']}" @click="makeActiveSwatch(i)"></div>                
            </li>
            <li @click="addColor()">Add</li>
        </ul>

        <sketch-picker v-model="palette[activeSwatch]" @input="updatePallete" v-if="colorPickerOpen"/>

    </div>
</template>

<script>

import {Sketch} from 'vue-color'

export default {
    components: {
        'sketch-picker': Sketch
    },
    props: ['initialPalette'],
    data() {
        return {
            // numberOfColors: 4,
            colorPickerOpen: false,
            activeSwatch: 0,
            palette: [{hex: '#ff00ff'},{hex: '#ff0000'}], // the colors as they are created by the color pickers
            convertedColorArray: [], // the colors as they are sent to the ditherer ([0,0,0])
        }
    },
    watch: { 
        initialPalette: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.rgbToHex(newVal)
        }
    },    
    methods: {
        // Make Active Swatch
        // When a swatch is clicked on, make it active and open the color picker
        makeActiveSwatch(i) {
            this.activeSwatch = i //tells the picker which swatch is being updated
            this.colorPickerOpen = true
        },
        // Update Colors
        // This updates the colors that are used by the actual ditherer
        // Requires an array of hex colors in the format [{hex: '#ff000'},{hex: '#ff0ff'}]
        updatePallete(){ // update the colors, requires an array of
            var colorTuplesArray = [];
            this.palette.forEach((v) => {
                colorTuplesArray.push(this.hexToRgb(v['hex']))
            })
            this.$emit('update-palette', colorTuplesArray)
            this.colorPickerOpen = false
        },
        //Convert Hex to RGB
        // Given a hex value, return the RGB tuple
        hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : null;
        },
        // Convert RGB To Hex
        // this converts an array of tupes into hex values
        rgbToHex() {
            this.palette = []
            var pal = this.initialPalette;
            for (let i=0; i<pal.length; i++) {
                var r = pal[i][0];
                var g = pal[i][1];
                var b = pal[i][2];
                var hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                this.palette.push({hex});  
            }
        },  
        // Add Color
        // This adds a new color to the colors        
        addColor(){
            this.activeSwatch = this.activeSwatch + 1
            this.palette.push({})
            // console.log(this.colorPickerOpen)
            this.colorPickerOpen = true
            
        }      
     
    }
}
</script>