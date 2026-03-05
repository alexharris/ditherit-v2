<template>
  <div class="embed-root">
    <!-- Header with cancel -->
    <div class="embed-header">
      <div>
        <h2 class="embed-title">🏆 Dither Tournament</h2>
        <p class="embed-sub">Pick a winner — settings will be applied to your whole batch</p>
      </div>
      <button class="btn-ghost small" @click="$emit('cancel')">✕ Cancel &amp; go back</button>
    </div>

    <!-- Wizard steps reused from DitherTournament but source is pre-set -->
    <div v-if="phase === 'wizard'" class="wizard-wrap">
      <div class="wizard-card">
        <div class="step-dots">
          <div v-for="s in 4" :key="s" class="step-dot" :class="{ active: wizardStep === s, done: wizardStep > s }"></div>
        </div>

        <!-- Step 1: Blind -->
        <div v-if="wizardStep === 1" class="wizard-step">
          <h3 class="step-heading">Show algorithm names?</h3>
          <div class="mode-cards">
            <div class="mode-card" :class="{ selected: showLabels === true }" @click="showLabels = true"><div class="mode-icon">🏷️</div><div class="mode-name">Show names</div></div>
            <div class="mode-card" :class="{ selected: showLabels === false }" @click="showLabels = false"><div class="mode-icon">🙈</div><div class="mode-name">Blind</div></div>
          </div>
          <div class="wiz-btn-row">
            <div></div>
            <button class="btn-primary" :disabled="showLabels === null" @click="wizardStep = 2">Next →</button>
          </div>
        </div>

        <!-- Step 2: Mode -->
        <div v-if="wizardStep === 2" class="wizard-step">
          <h3 class="step-heading">Dither mode</h3>
          <div class="mode-cards">
            <div class="mode-card" :class="{ selected: options.mode === 'error' }" @click="options.mode = 'error'"><div class="mode-icon">〰️</div><div class="mode-name">Error Diffusion</div></div>
            <div class="mode-card" :class="{ selected: options.mode === 'bayer' }" @click="options.mode = 'bayer'"><div class="mode-icon">⬛</div><div class="mode-name">Bayer</div></div>
            <div class="mode-card" :class="{ selected: options.mode === 'both' }" @click="options.mode = 'both'"><div class="mode-icon">⚡</div><div class="mode-name">Both</div></div>
          </div>
          <div class="wiz-btn-row">
            <button class="btn-ghost" @click="wizardStep = 1">← Back</button>
            <button class="btn-primary" :disabled="!options.mode" @click="wizardStep = 3">Next →</button>
          </div>
        </div>

        <!-- Step 3: Palette -->
        <div v-if="wizardStep === 3" class="wizard-step">
          <h3 class="step-heading">Colour palette</h3>
          <div class="palette-grid">
            <div v-for="p in paletteOptions" :key="p.value" class="palette-chip" :class="{ selected: options.palette === p.value }" @click="options.palette = p.value">
              <div class="palette-swatches"><div v-for="c in p.colors.slice(0,5)" :key="c" class="palette-swatch" :style="{ background: c }"></div></div>
              <div class="palette-label">{{ p.name }}</div>
            </div>
            <div v-if="customGplPalette" class="palette-chip" :class="{ selected: options.palette === 'custom-gpl' }" @click="options.palette = 'custom-gpl'">
              <div class="palette-swatches"><div v-for="c in customGplPalette.colors.slice(0,5)" :key="c" class="palette-swatch" :style="{ background: c }"></div></div>
              <div class="palette-label">📄 {{ customGplPalette.name }}</div>
            </div>
          </div>
          <div class="gpl-upload-row">
            <div class="pal-import-col">
              <p class="pal-import-label">Paste JSON palette:</p>
              <textarea v-model="paletteJsonImport" rows="3" placeholder='[{"hex":"#ff0000"},{"hex":"#000000"}]' class="pal-import-textarea"></textarea>
              <button class="pal-import-btn" @click="importJsonPalette">Import JSON</button>
              <span v-if="paletteImportError" class="pal-import-error">{{ paletteImportError }}</span>
              <span v-if="paletteImportSuccess" class="pal-import-success">{{ paletteImportSuccess }}</span>
            </div>
            <div class="pal-import-col">
              <p class="pal-import-label">Upload GIMP .gpl file:</p>
              <label class="pal-import-btn">
                📂 Upload .gpl palette
                <input type="file" accept=".gpl" class="hidden" @change="loadGplPalette" />
              </label>
              <span v-if="gplError" class="pal-import-error">{{ gplError }}</span>
              <span v-if="gplSuccess" class="pal-import-success">{{ gplSuccess }}</span>
            </div>
          </div>
          <div class="wiz-btn-row">
            <button class="btn-ghost" @click="wizardStep = 2">← Back</button>
            <button class="btn-primary" :disabled="!options.palette" @click="onPaletteNext">Next →</button>
          </div>
        </div>

        <!-- Step 4: Serpentine -->
        <div v-if="wizardStep === 4" class="wizard-step">
          <h3 class="step-heading">Serpentine dithering</h3>
          <div class="mode-cards">
            <div class="mode-card" :class="{ selected: options.serpentine === false }" @click="options.serpentine = false"><div class="mode-icon">➡️</div><div class="mode-name">Off</div></div>
            <div class="mode-card" :class="{ selected: options.serpentine === true }" @click="options.serpentine = true"><div class="mode-icon">🐍</div><div class="mode-name">On</div></div>
            <div class="mode-card" :class="{ selected: options.serpentine === 'both' }" @click="options.serpentine = 'both'"><div class="mode-icon">🔀</div><div class="mode-name">Both</div></div>
          </div>
          <div v-if="willProduceSingle" class="single-warning">⚠️ These options only produce 1 image — nothing to compare. Choose "Both" or go back.</div>
          <div class="wiz-btn-row">
            <button class="btn-ghost" @click="wizardStep = 3">← Back</button>
            <button class="btn-primary" :disabled="options.serpentine === null || willProduceSingle" @click="startProcessing">🏁 Start tournament</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Processing -->
    <div v-if="phase === 'processing'" class="processing-wrap">
      <div class="processing-card">
        <div class="processing-spinner"></div>
        <h3>Rendering variants…</h3>
        <p>{{ doneCount }} / {{ totalCount }}</p>
        <div class="bar-track"><div class="bar-fill" :style="{ width: progressPct + '%' }"></div></div>
      </div>
      <div style="position:absolute;left:-9999px;top:-9999px;">
        <img ref="sourceImg" :src="sourceDataUrl" alt="" @load="onSourceLoad" style="display:block" />
        <canvas v-for="v in variants" :key="v.id" :ref="'canvas_' + v.id"></canvas>
      </div>
    </div>

    <!-- Tournament bracket -->
    <div v-if="phase === 'tournament'" class="tournament-wrap">
      <div class="t-progress-track"><div class="t-progress-fill" :style="{ width: roundProgressPct + '%' }"></div></div>
      <p class="t-progress-label">Round {{ currentRound }} · match {{ matchIndex + 1 }} of {{ currentPairs.length }}</p>
      <div v-if="currentMatch" class="match-arena">
        <div class="match-card" @click="pick(currentMatch[0])">
          <div class="match-label">{{ showLabels ? currentMatch[0].label : 'Option A' }}</div>
          <img :src="currentMatch[0].dataUrl" class="match-img" :alt="currentMatch[0].label" />
          <div class="match-pick-btn">✓ Pick this one</div>
        </div>
        <div class="vs-badge">VS</div>
        <div class="match-card" @click="pick(currentMatch[1])">
          <div class="match-label">{{ showLabels ? currentMatch[1].label : 'Option B' }}</div>
          <img :src="currentMatch[1].dataUrl" class="match-img" :alt="currentMatch[1].label" />
          <div class="match-pick-btn">✓ Pick this one</div>
        </div>
      </div>
    </div>

    <!-- Winner — emit and show apply button -->
    <div v-if="phase === 'winner'" class="winner-wrap">
      <div class="winner-card">
        <div v-if="singleVariant" class="single-variant-notice">
          ℹ️ Your settings only produced one possible result — no bracket needed. These settings will be applied to all images.
        </div>
        <div class="winner-crown">👑</div>
        <h2 class="winner-title">{{ singleVariant ? 'Only option!' : 'Winner!' }}</h2>
        <p class="winner-label">{{ winner.label }}</p>
        <img :src="winner.dataUrl" class="winner-img" :alt="winner.label" />
        <div class="winner-settings">
          <div class="setting-row"><span class="sk">Mode</span><span class="sv">{{ winner.config.mode }}</span></div>
          <div v-if="winner.config.algorithm" class="setting-row"><span class="sk">Algorithm</span><span class="sv">{{ winner.config.algorithm }}</span></div>
          <div v-if="winner.config.serpentine !== undefined" class="setting-row"><span class="sk">Serpentine</span><span class="sv">{{ winner.config.serpentine ? 'On' : 'Off' }}</span></div>
          <div class="setting-row"><span class="sk">Palette</span><span class="sv">{{ winner.config.paletteName }}</span></div>
        </div>
        <button class="btn-primary large" @click="applyToBatch">🚀 Apply these settings to all batch images</button>
        <button class="btn-ghost mt-2" @click="$emit('cancel')">✕ Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import { bayerDither } from '~/utils/dithering'

const ERROR_ALGORITHMS = ['FloydSteinberg','Atkinson','Sierra24A','Fan','ShiauFan','ShiauFan2','JarvisJudiceNinke','Stucki','Burkes','Sierra3','Sierra2']
const PRESET_PALETTES = [
  { name: 'Original (auto)', value: 'original', colors: ['#888','#444','#ccc','#222','#fff'] },
  { name: 'Black & White', value: 'blackwhite', colors: ['#ffffff','#000000'] },
  { name: 'CMYK', value: 'cmyk', colors: ['#000000','#ffff00','#00FFFF','#FF00FF','#FFFFFF'] },
  { name: 'Game Boy', value: 'gameboy', colors: ['#CADC9F','#0F380F','#306230','#8BAC0F','#9BBC0F'] },
  { name: 'Red Monochrome', value: 'redmono', colors: ['#ffe3db','#4f1403'] },
  { name: 'Blue & Yellow', value: 'blueyellow', colors: ['#134E87','#FFF585'] },
  { name: 'Green Monochrome', value: 'greenmono', colors: ['#eeffdb','#1d3801'] },
  { name: 'Red', value: 'red', colors: ['#ffffff','#f46842','#aa2f0d','#000000'] },
  { name: 'Black White Red', value: 'bwr', colors: ['#FFFFFF','#000000','#FF0000'] },
  { name: 'Purple & Green', value: 'purplegreen', colors: ['#76C066','#AD2BBB'] },
]
const PALETTE_COLORS = {
  original: null, blackwhite: ['#ffffff','#000000'], cmyk: ['#000000','#ffff00','#00FFFF','#FF00FF','#FFFFFF'],
  gameboy: ['#CADC9F','#0F380F','#306230','#8BAC0F','#9BBC0F'], redmono: ['#ffe3db','#4f1403'],
  blueyellow: ['#134E87','#FFF585'], greenmono: ['#eeffdb','#1d3801'], red: ['#ffffff','#f46842','#aa2f0d','#000000'],
  bwr: ['#FFFFFF','#000000','#FF0000'], purplegreen: ['#76C066','#AD2BBB'],
}
function hexToRgb(hex) { const r=new RegExp('^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$','i').exec(hex); return r?[parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)]:null }
function shuffle(arr) { const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a }
function buildVariants(mode, serpOpt) {
  const v=[]
  if(mode==='error'||mode==='both'){const s=serpOpt==='both'?[false,true]:[serpOpt];ERROR_ALGORITHMS.forEach(a=>s.forEach(serp=>v.push({id:'err_'+a+'_'+(serp?'serp':'noserp'),label:a+(serp?' (serpentine)':''),config:{mode:'Error Diffusion',algorithm:a,serpentine:serp}})))}
  if(mode==='bayer'||mode==='both'){v.push({id:'bayer',label:'Bayer (Ordered)',config:{mode:'Bayer (Ordered)'}})}
  return v
}

export default {
  name: 'DitherTournamentEmbed',
  props: { sourceDataUrl: { type: String, required: true } },
  data() {
    return {
      phase: 'wizard', wizardStep: 1, showLabels: null,
      options: { mode: null, palette: null, serpentine: null },
      customGplPalette: null,
      gplError: '',
      gplSuccess: '',
      paletteJsonImport: '',
      paletteImportError: '',
      paletteImportSuccess: '',
      variants: [], contestants: [], bracket: [], winners: [], currentPairs: [],
      matchIndex: 0, currentRound: 1, totalRounds: 1,
      doneCount: 0, totalCount: 0, rendering: false,
      winner: null, singleVariant: false,
    }
  },
  computed: {
    paletteOptions() { return PRESET_PALETTES },
    progressPct() { return this.totalCount===0?0:Math.round(this.doneCount/this.totalCount*100) },
    currentMatch() { return this.currentPairs[this.matchIndex]||null },
    roundProgressPct() { return this.currentPairs.length===0?0:Math.round(this.matchIndex/this.currentPairs.length*100) },
    willProduceSingle() {
      if(!this.options.mode||this.options.serpentine===null) return false
      return buildVariants(this.options.mode, this.options.serpentine).length<=1
    }
  },
  methods: {
    onPaletteNext() {
      if(this.options.mode==='bayer'){this.options.serpentine=false;this.startProcessing()}
      else this.wizardStep=4
    },
    async startProcessing() {
      this.phase='processing'; this.rendering=false
      this.variants=buildVariants(this.options.mode, this.options.serpentine)
      const paletteName=this.options.palette==='custom-gpl'&&this.customGplPalette?this.customGplPalette.name:(PRESET_PALETTES.find(p=>p.value===this.options.palette)?.name||'Original')
      this.variants.forEach(v=>{v.config.paletteName=paletteName})
      this.totalCount=this.variants.length; this.doneCount=0
      await this.$nextTick()
      if(this.$refs.sourceImg&&this.$refs.sourceImg.complete) await this.renderAll()
    },
    async onSourceLoad() { if(this.phase==='processing'&&!this.rendering) await this.renderAll() },
    async renderAll() {
      if(this.rendering) return; this.rendering=true
      const img=this.$refs.sourceImg; const w=img.naturalWidth; const h=img.naturalHeight
      let paletteRgb=null
      if(this.options.palette==='custom-gpl'&&this.customGplPalette){paletteRgb=this.customGplPalette.rgb}
      else if(this.options.palette!=='original'){const hx=PALETTE_COLORS[this.options.palette];if(hx)paletteRgb=hx.map(c=>hexToRgb(c)).filter(Boolean)}
      const contestants=[]
      for(const v of this.variants){
        await new Promise(r=>setTimeout(r,10))
        const ref=this.$refs['canvas_'+v.id]; const canvas=Array.isArray(ref)?ref[0]:ref
        if(!canvas){this.doneCount++;continue}
        const ctx=canvas.getContext('2d'); canvas.width=w; canvas.height=h; ctx.drawImage(img,0,0,w,h)
        try{
          if(v.config.mode==='Bayer (Ordered)'){const id=ctx.getImageData(0,0,w,h);const pal=paletteRgb||this.autoSample(img);bayerDither(ctx,id,pal,1)}
          else{const q=new RgbQuant({colors:paletteRgb?paletteRgb.length:8,method:2,boxSize:[8,8],boxPxls:2,initColors:4096,minHueCols:2000,dithKern:v.config.algorithm,dithDelta:0,dithSerp:v.config.serpentine,reIndex:false,useCache:true,cacheFreq:10,colorDist:'euclidean',palette:paletteRgb||[]});q.sample(img);const res=q.reduce(canvas);const id=ctx.getImageData(0,0,w,h);id.data.set(res);ctx.putImageData(id,0,0)}
        }catch(e){}
        contestants.push({...v,dataUrl:canvas.toDataURL('image/png'),roundsSurvived:0})
        canvas.width=1;canvas.height=1;this.doneCount++
      }
      // If only one variant rendered, skip bracket and go straight to winner
      if (contestants.length === 1) {
        this.winner = contestants[0]
        this.singleVariant = true
        this.phase = 'winner'
        return
      }
      if (contestants.length === 0) {
        this.phase = 'wizard'
        return
      }
      this.contestants=shuffle(contestants); this.setupRound(this.contestants)
      this.totalRounds=Math.ceil(Math.log2(this.contestants.length)); this.phase='tournament'
    },
    importJsonPalette() {
      this.paletteImportError = ''; this.paletteImportSuccess = ''
      try {
        const parsed = JSON.parse(this.paletteJsonImport)
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty')
        if (parsed.length > 256) { this.paletteImportError = 'Maximum 256 colours allowed.'; return }
        const colors = parsed.map(e => typeof e === 'string' ? e : e.hex).filter(Boolean)
        this.customGplPalette = { name: 'JSON Import', colors, rgb: colors.map(h => hexToRgb(h)).filter(Boolean) }
        this.options.palette = 'custom-gpl'
        this.paletteJsonImport = ''
        this.paletteImportSuccess = 'Loaded ' + colors.length + ' colours'
      } catch(e) {
        this.paletteImportError = 'Invalid JSON. Expected: [{"hex":"#ff0000"},...]'
      }
    },
    loadGplPalette(e) {
      this.gplError = ''; this.gplSuccess = ''
      const file = e.target.files[0]; if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = this.parseGpl(ev.target.result)
        if (result.error) { this.gplError = result.error; return }
        if (result.colors.length === 0) { this.gplError = 'No colours found in this .gpl file.'; return }
        if (result.colors.length > 256) { this.gplError = `This palette has ${result.colors.length} colours — maximum is 256.`; return }
        this.customGplPalette = {
          name: result.name, colors: result.colors,
          rgb: result.colors.map(h => hexToRgb(h)).filter(Boolean)
        }
        this.options.palette = 'custom-gpl'
        this.gplSuccess = `Loaded "${result.name}" — ${result.colors.length} colours`
      }
      reader.onerror = () => { this.gplError = 'Could not read the file.' }
      reader.readAsText(file); e.target.value = ''
    },
    parseGpl(text) {
      const lines = text.split('\n').map(l => l.charAt(l.length-1)==='\r' ? l.slice(0,-1) : l)
      if (!lines[0] || lines[0].trim() !== 'GIMP Palette') return { error: 'Not a valid GIMP .gpl file.' }
      let name = 'Custom GPL'
      const colors = []
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.startsWith('#')) continue
        if (line.startsWith('Name:')) { name = line.replace('Name:', '').trim(); continue }
        if (line.startsWith('Columns:')) continue
        const parts = line.split(' ').join('\t').split('\t').filter(s => s.length > 0)
        if (parts.length >= 3) {
          const r = parseInt(parts[0]), g = parseInt(parts[1]), b = parseInt(parts[2])
          if (!isNaN(r) && !isNaN(g) && !isNaN(b) && r <= 255 && g <= 255 && b <= 255) {
            colors.push('#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''))
          }
        }
      }
      return { name, colors }
    },
    autoSample(img){const c=document.createElement('canvas');c.width=16;c.height=16;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,16,16);const d=ctx.getImageData(0,0,16,16).data;const col=[];for(let i=0;i<d.length;i+=64)col.push([d[i],d[i+1],d[i+2]]);return col.slice(0,16)},
    setupRound(pool){
      this.bracket=pool.slice(); const pairs=[]
      for(let i=0;i+1<this.bracket.length;i+=2)pairs.push([this.bracket[i],this.bracket[i+1]])
      if(this.bracket.length%2===1){const bye=this.bracket[this.bracket.length-1];bye.roundsSurvived++;this.winners=[bye]}else{this.winners=[]}
      this.currentPairs=pairs; this.matchIndex=0
    },
    pick(chosen){
      const pair=this.currentPairs[this.matchIndex]; const loser=pair[0]===chosen?pair[1]:pair[0]
      chosen.roundsSurvived++; loser.dataUrl=null
      this.winners.push(chosen); this.matchIndex++
      if(this.matchIndex>=this.currentPairs.length){
        if(this.winners.length===1){this.winner=this.winners[0];this.phase='winner'}
        else{this.currentRound++;this.setupRound(shuffle(this.winners))}
      }
    },
    applyToBatch() {
      const paletteName = this.options.palette==='custom-gpl'&&this.customGplPalette ? this.customGplPalette.name : (PRESET_PALETTES.find(p=>p.value===this.options.palette)?.name||'Original')
      this.$emit('tournament-complete', {
        mode: this.winner.config.mode === 'Error Diffusion' ? 'error' : 'bayer',
        algorithm: this.winner.config.algorithm || null,
        serpentine: this.winner.config.serpentine !== undefined ? this.winner.config.serpentine : false,
        palette: this.options.palette,
        paletteName,
        customGplPalette: this.options.palette === 'custom-gpl' ? this.customGplPalette : null,
      })
    }
  }
}
</script>

<style scoped>
.embed-root { font-family: 'Georgia', serif; width: 100%; max-width: 960px; display: flex; flex-direction: column; gap: 1.5rem; }
.embed-header { display: flex; justify-content: space-between; align-items: flex-start; }
.embed-title { font-size: 1.6rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.embed-sub { color: #666; font-size: 0.88rem; margin: 0.2rem 0 0; }

.wizard-wrap { width: 100%; }
.wizard-card { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 5px 5px 0 #1a1a1a; padding: 2rem; }
.step-dots { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.step-dot { width: 10px; height: 10px; border-radius: 50%; background: #ddd; }
.step-dot.active { background: #c53030; transform: scale(1.3); }
.step-dot.done { background: #1a1a1a; }
.wizard-step { display: flex; flex-direction: column; gap: 1rem; }
.step-heading { font-size: 1.2rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.mode-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; }
.mode-card { border: 2px solid #ddd; border-radius: 4px; padding: 1rem; cursor: pointer; transition: all 0.15s; text-align: center; background: #faf8f5; }
.mode-card:hover { border-color: #c53030; }
.mode-card.selected { border-color: #c53030; background: #fff5f5; box-shadow: 3px 3px 0 #c53030; }
.mode-icon { font-size: 1.5rem; margin-bottom: 0.3rem; }
.mode-name { font-weight: 700; font-size: 0.88rem; color: #1a1a1a; }
.palette-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem; max-height: 300px; overflow-y: auto; }
.palette-chip { border: 2px solid #ddd; border-radius: 4px; padding: 0.5rem; cursor: pointer; transition: all 0.15s; background: #fff; }
.palette-chip:hover { border-color: #c53030; }
.palette-chip.selected { border-color: #c53030; box-shadow: 3px 3px 0 #c53030; }
.palette-swatches { display: flex; height: 18px; border-radius: 2px; overflow: hidden; margin-bottom: 0.3rem; }
.palette-swatch { flex: 1; }
.palette-label { font-size: 0.72rem; font-weight: 600; color: #1a1a1a; }
.single-warning { background: #fff3cd; border: 2px solid #f0ad4e; border-radius: 4px; padding: 0.75rem; font-size: 0.88rem; color: #856404; }
.wiz-btn-row { display: flex; justify-content: space-between; }

.processing-wrap { display: flex; align-items: center; justify-content: center; min-height: 40vh; }
.processing-card { text-align: center; background: #fff; border: 2px solid #1a1a1a; box-shadow: 5px 5px 0 #1a1a1a; border-radius: 4px; padding: 2.5rem; max-width: 360px; width: 100%; }
.processing-spinner { width: 44px; height: 44px; border: 4px solid #eee; border-top-color: #c53030; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem; }
.bar-track { height: 7px; background: #eee; border-radius: 4px; overflow: hidden; margin-top: 1rem; }
.bar-fill { height: 100%; background: #c53030; transition: width 0.3s; }

.tournament-wrap { width: 100%; }
.t-progress-track { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-bottom: 0.35rem; }
.t-progress-fill { height: 100%; background: #c53030; transition: width 0.4s; }
.t-progress-label { font-size: 0.8rem; color: #999; margin: 0 0 1.25rem; }
.match-arena { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; }
.match-card { border: 2px solid #ddd; border-radius: 4px; overflow: hidden; cursor: pointer; transition: all 0.18s; background: #fff; display: flex; flex-direction: column; }
.match-card:hover { border-color: #c53030; box-shadow: 4px 4px 0 #c53030; transform: translateY(-3px); }
.match-label { font-size: 0.78rem; font-weight: 700; padding: 0.5rem; background: #1a1a1a; color: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.match-img { width: 100%; height: auto; display: block; image-rendering: pixelated; }
.match-pick-btn { padding: 0.55rem; text-align: center; font-size: 0.82rem; font-weight: 700; color: #c53030; border-top: 1px solid #eee; transition: all 0.15s; }
.match-card:hover .match-pick-btn { background: #c53030; color: #fff; border-color: #c53030; }
.vs-badge { font-size: 1.3rem; font-weight: 900; background: #fff; border: 2px solid #1a1a1a; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 3px 3px 0 #1a1a1a; }

.winner-wrap { display: flex; justify-content: center; }
.winner-card { background: #fff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 #1a1a1a; border-radius: 4px; padding: 2rem; text-align: center; max-width: 480px; width: 100%; }
.single-variant-notice { background: #fff8e1; border: 2px solid #f0ad4e; border-radius: 4px; padding: 0.75rem; font-size: 0.85rem; color: #856404; margin-bottom: 1rem; text-align: left; line-height: 1.4; }
.winner-crown { font-size: 2.5rem; }
.winner-title { font-size: 2rem; font-weight: 900; color: #c53030; margin: 0 0 0.25rem; }
.winner-label { font-size: 1rem; font-weight: 700; margin: 0 0 1rem; color: #1a1a1a; }
.winner-img { width: 100%; height: auto; display: block; image-rendering: pixelated; border: 2px solid #eee; margin-bottom: 1.25rem; }
.winner-settings { text-align: left; background: #faf8f5; border: 1px solid #eee; border-radius: 4px; padding: 0.75rem; margin-bottom: 1.25rem; }
.setting-row { display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #eee; font-size: 0.85rem; }
.setting-row:last-child { border-bottom: none; }
.sk { color: #888; font-weight: 600; } .sv { color: #1a1a1a; font-weight: 700; }

.btn-primary { display: inline-block; background: #c53030; color: #fff; border: 2px solid #c53030; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; width: 100%; box-sizing: border-box; }
.btn-primary:hover:not(:disabled) { background: #9b2c2c; border-color: #9b2c2c; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary.large { font-size: 1.05rem; padding: 0.75rem; }
.btn-ghost { display: inline-block; background: transparent; color: #1a1a1a; border: 2px solid #1a1a1a; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-ghost:hover { background: #1a1a1a; color: #fff; }
.btn-ghost.small { font-size: 0.8rem; padding: 0.4rem 0.9rem; }
.mt-2 { margin-top: 0.5rem; width: 100%; box-sizing: border-box; }

.gpl-upload-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; }
.pal-import-col { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 160px; }
.pal-import-label { font-size: 0.72rem; font-weight: 700; color: #555; margin: 0; }
.pal-import-textarea { font-size: 0.72rem; border: 1px solid #ccc; border-radius: 2px; padding: 0.35rem; font-family: monospace; resize: vertical; }
.pal-import-btn { font-size: 0.75rem; font-weight: 700; font-family: inherit; border: 2px solid #1a1a1a; background: #fff; color: #1a1a1a; padding: 0.25rem 0.6rem; border-radius: 2px; cursor: pointer; transition: all 0.15s; display: inline-block; }
.pal-import-btn:hover { background: #1a1a1a; color: #fff; }
.pal-import-error { font-size: 0.72rem; color: #c53030; font-weight: 600; }
.pal-import-success { font-size: 0.72rem; color: #2d7a2d; font-weight: 600; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 600px) { .match-arena { grid-template-columns: 1fr; } .vs-badge { margin: 0 auto; } }
</style>
