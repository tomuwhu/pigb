<template>
  <div id="app">
	<div class="onlyprint">
		Fejléc, csak nyomtatáshoz <img src="./assets/logo.png" />
	</div>
	<div style="text-align:center;" class="no-print">
	<input v-model="toload"> - - 
  <span v-if="toload==='getlist'" >
    <button @click="getlist()">Lista letöltése</button>
    <select v-model="toload" v-if="lista.length" @change="loadfromserver(toload)">
			<option />
			<option :key="elem._id" v-for="elem in lista">{{elem._id}}</option>
		</select>
  </span>
	<button v-if="toload.length>10" @click="loadfromserver(toload)">Letölt</button>
	- - -
	<button @click="o={ pt: [ {} ] }" style="color:red;">Űrlapadatok törlése</button>
	</div>
	<hr>
	<h1>Pályázati bejelentő adatlap - nemzetközi</h1>
	<h2>1. Általános adatok</h2>
	<p>
		<hr>
		<h3>1.1 Pályázatért felelős iskola neve, címe:</h3>
		<select v-model="o.iskola">
			<option />
			<option value="1">Szegedi SzC Gábor Dénes Szakgimnáziuma (062101)</option>
			<option value="2">Szegedi SzC Csonka János Szakgimnáziuma és Szakközépiskolája (062102)</option>
			<option value="3">Szegedi SzC Kőrösy József Közgazdasági Szakgimnáziuma (062103)</option>
			<option value="4">Szegedi SzC Vasvári Pál Gazdasági és Informatikai Szakgimnáziuma (062104)</option>
			<option value="5">Szegedi SzC Krúdy Gyula Kereskedelmi, Vedéglátóipari és Turisztikai Szakgimnáziuma és Szakközépiskolája (062105)</option>
			<option value="6">Szegedi SzC Móravárosi Szakgimnáziuma és Szakközépiskolája (062106)</option>
			<option value="7">Szegedi SzC József Attila Általános Iskolája és Szakiskolája (062107)</option>
			<option value="8">Szegedi SzC Déri Miksa Szakgimnáziuma és Szakközépiskolája (062108)</option>
			<option value="9">Szegedi SzC Vedres István Építőipari Szakgimnáziuma (062109)</option>
			<option value="10">Szegedi SzC Kossuth Zsuzsanna Szakképző Iskolája (062110)</option>
			<option value="11">Szegedi SzC Hansági Ferenc Szakképző Iskolája (062111)</option>
		</select>
		<h3>1.2 Intézmény szerepe </h3>
		<select v-model="o.iszerep">
			<option />
			<option value="1">önálló pályázó </option> 
			<option value="2">résztevevő </option> 
			<option value="3">konzorciumvezető </option> 
			<option value="4">konzorciumi tag </option> 
			<option value="0">egyéb:</option>
		</select>
		<input v-if="o.iszerep=='0'"  v-model="o.iszerep_egy" />

		<h3>1.3 Kapcsolattartó neve </h3>
		<input id="ktn" placeholder="Vezetéknév Keresztnév" v-model="o.kapcsolattarto" />
		<h3>1.4 Kapcsolattartó szerepe </h3>
		<select v-model="o.ktszerep">
			<option />
			<option value="1">koordinátor </option> 
			<option value="2">projektmenedzser </option> 
			<option value="3">szakmai vezető </option>  
			<option value="0">egyéb:</option>
		</select>
		<input v-if="o.ktszerep=='0'" v-model="o.ktszerep_egy" />	
		<h3>1.5 Kapcsolattartó elérhetősége (mobil telefonszám, e-mail cím): </h3>
		<input placeholder="mobilszám" v-model="o.ktmobil" /> &nbsp;
		<input style="width:250px;" type="email" placeholder="e-mail cím" v-model="o.ktemail" />
		<h3 v-if="o.pt.length<2">1.6 Partner</h3>
		<h3 v-else>Partnerek</h3>
		<div :key="index" v-for="(partner,index) in o.pt" class="m20 no-print">
			{{index+1}}. 
			<input placeholder="intézmény rövid neve"  v-model="partner.pintnev"/>
			Intézmény címe: 
			<input placeholder="Cím" v-model="partner.cim"/> &nbsp;
			<input placeholder="Ország" v-model="partner.porszag"/> &nbsp;
			<input placeholder="Kapcsolattartó neve" v-model="partner.ktneve"/> &nbsp;
		</div>
		<table class="onlyprint">
			<tr><th>#</th><th>Inzézmény neve  &nbsp; </th><th>Cím</th><th>Kapcsolattartó</th></tr>
			<tr :key="index" v-for="(partner,index) in o.pt" v-show="partner.pintnev">
				<td>
					{{index+1}}.
				</td>
				<td>	
					{{partner.pintnev}} &nbsp;
				</td>
				<td>
					{{partner.cim}}
					{{partner.porszag}} &nbsp;
				</td>
				<td>
					{{partner.ktneve}} &nbsp;
				</td>
			</tr>
		</table>
		<div style="text-align:center;" class="no-print">
			<button v-if="!o.pt.filter(v => !v.pintnev ).length" @click="o.pt.push({})">+ további partner hozzáadása +</button> &nbsp; 
			<button v-if="o.pt.filter(v => !v.pintnev ).length" @click="ust()">- Üres sorok törlése -</button>
		</div>
	<h2>2. Szakmai információk </h2>
	<hr>
	<p>
		<h3>2.1 Pályázati Program: </h3>
		<select v-model="o.pp">
			<option />
			<option value="epp">Erasmus+ </option> 
			<option value="htu">Határtalanul! </option> 
			<option value="egy">Egyéb </option>
		</select> &nbsp;
		<input v-if="o.pp=='egy'" /> 
		<select v-if="o.pp=='epp'" v-model="o.ppep">
			<option />
			<option value="11">KA1 közoktatási </option> 
			<option value="12">KA1 szakképzési</option> 
			<option value="13">KA1 tanúsítványos </option>
			<option value="20">KA2 </option>
			<option value="icsp">Ifjúsági csereprogram </option>
			<option value="0">egyéb: </option>
		</select> &nbsp;
		<input v-if="o.ppep=='0'" v-model="o.ppep_egy"/>
		<h3>2.2 A kiírás elérhetősége (weboldal):</h3>
		<input v-model="o.elerh"/>
		<h3> 2.3 A pályázat célja: </h3>
		<textarea  v-model="o.pcelja"></textarea>
		<h3>2.4 Pályázat benyújtásához szükséges dokumentumok (a dokumentumot kiállító szerv megnevezésével): </h3>
		<textarea v-model="o.bszuksdok"></textarea>
		<h3>2.5 Pályázat benyújtásának határideje: </h3>
		<input type="date" v-model="o.pbenyujthatid"/>
		<h3>2.6 A projekt rövid szakmai összefoglalása, tervezett kiutazások, turnusok, létszámok, időpontok, projektmenedzsment...: </h3>
		<textarea id="tb1" v-model="o.pprszakami"/>
		<h3>2.7 A pályázat során beszerzésre kerülő tárgyi eszközök (amenniyben nem releváns kérjük írja be: Nincs): </h3>
		<textarea v-model="o.besztargyie"></textarea>
	<h2>3. Pénzügyi információk</h2>
	<hr>
	<h3>3.1 Igényelt támogatás összege: </h3>
	<span v-if="o.pp!=='epp'">
		<input	class="ir" type="number" min="0" v-model="o.ito" pattern=""/> &nbsp; 
		<span v-if="o.pp==='egy'">
			<select v-model="o.penznem">
				<option>HUF</option>
				<option>EUR</option>
			</select>
		</span>
		<span v-else>HUF</span>
		<h3>3.2 A projekt összköltsége: </h3>
			<input class="ir" type="number" min="0" v-model="o.oszk" pattern=""/> &nbsp; <span v-if="o.penznem">{{o.penznem}}</span><span v-else>HUF</span>
		<h3>3.3 Önerő mértéke (amennyiben releváns): </h3>
			<input class="ir" type="number" min="0" v-model="o.on"/> &nbsp; <span v-if="o.penznem">{{o.penznem}}</span><span v-else>HUF</span>
		<h3>3.4 Egyéb forrás (amennyiben releváns): </h3>
			<input class="ir" type="number" min="1" v-model="o.ef" />
			&nbsp; <span v-if="o.penznem">{{o.penznem}}</span><span v-else>HUF</span>
		<h3>3.5 A pályázat finanszírozásának módja: </h3>
			<select v-model="o.ff" @change="o.szazalek=o.ff==='uf'?'100':'0'" >
				<option />
				<option value="uf">utófinanszírozás </option> 
				<option value="te">teljes előfinanszírozás </option> 
				<option value="re">rész előfinanszírozás </option>
			</select>
			<span v-if="o.ff=='re'">
				&nbsp;
				<input class="ir" type="number" v-model="o.szazalek" min="1" max="99" /> %
			</span>
			<span v-if="o.ff=='re' && Number(o.szazalek)>0"/></span>
			<span v-if="reszfin>0">
				<h3>
					A Szegedi Szakképzési Centrum által előfinanszírozni 
					szükséges összeg (Számított érték): 
				</h3>
				<input class="ir" :value="reszfin" disabled/> HUF <br>
			</span>
	<span v-if="o.pp==='epp'">
		<input class="ir" type="number" min="0" v-model="o.ito" pattern=""/> &nbsp; EUR
		<span v-if="o.ito"> , azaz: 
			<input class="ir" :value="forint(Number(o.ito) * euro_arf)" disabled /> 
		</span>
		<h3> EPP 3.2 A projekt összköltsége: </h3>
		<input class="ir" type="number" min="0" v-model="o.oszk" pattern=""/> &nbsp; EUR
		<span v-if="o.oszk">, azaz: 
			<input class="ir" :value="forint(Number(o.oszk) * euro_arf)" disabled /> 
		</span>
		<h3>3.3 Önerő mértéke (amennyiben releváns): </h3>
		<input class="ir" type="number" min="0" v-model="o.on"/> &nbsp; EUR
		<span v-if="o.on">, azaz: 
			<input class="ir" :value="forint(Number(o.on) * euro_arf)" disabled /> 
		</span>
		<h3>3.4 Egyéb forrás (amennyiben releváns): </h3>
		<input class="ir" type="number" min="1" v-model="o.ef" />
		&nbsp; EUR
		<span v-if="o.ef">, azaz:
			<input class="ir" :value="forint(Number(o.ef) *  euro_arf)" disabled /> 
		</span>
		<h3>3.5 A pályázat finanszírozásának módja: </h3>
		<select v-model="o.ff"  @change="o.szazalek=o.ff==='uf'?'100':'0'">
			<option />
			<option value="uf">utófinanszírozás </option> 
			<option value="te">teljes előfinanszírozás </option> 
			<option value="re">rész előfinanszírozás </option>
		</select>
		<span v-if="o.ff=='re'">
			&nbsp;
			<input class="ir" type="number" v-model="o.szazalek" min="1" max="99" /> %
		</span>
		<span v-if="o.ff=='re' && Number(o.szazalek)>0">
			<h3>
				A Szegedi Szakképzési Centrum által előfinanszírozni 
				szükséges összeg (Számított érték): 
			</h3>
			<input class="ir" :value="euro(reszfin)"  disabled/> ,
			azaz: 
			<input class="ir" :value="forint(reszfin * euro_arf)" disabled/>
		</span> 
		<br>
	</span>
	<br><br>
	<div class="onlyprint" style="height:120px;"></div>
	<table border="0">
		<td style="width: 600px;">
			Kelt, <input type="date" v-model="o.kelt" />
		</td>
		<td style="text-align:center;" class="onlyprint">
			____________________<br>
			igazgató
		</td>
	</table>
	<h3 class="center">A Szegedi Szakképzési Centrum döntése</h3>
	<table style="width:100%;">
		<tr>
			<td colspan="4">
				<h4>A pályázati előkészítéséhez és benyújtásához hozzájárul:</h4>
			</td>
		</tr>
		<tr>
			<td class="negyed"></td>
			<td class="negyed">
				<h4 class="center">igen</h4><br><br>
			</td>
			<td class="negyed">
				<h4 class="center">nem</h4><br><br>
			</td>
			<td class="negyed"></td>
		</tr>
		<tr>
			<td colspan="2"	> Kelt: Szeged,................
			</td>
			<td class="center" colspan="2" > ..................................
			<br> Angyalné Kovács Anikó <br> főigazgató<br></td>
		</tr>

	</table>
	<hr class="no-print" />
	<div style="text-align: center;" class="no-print">
	<button @click="menttoserver()" :disabled="mbd">
		<span v-if="o._id">Módosítás beküldése</span>
		<span v-else>Beküld</span>
	</button>
	</div>
	<hr class="no-print" />
	<div style="text-align: center;">
		<span class="no-print">
			Mentési állapot: <i>{{saved}}</i>,  
			<span v-if="o._id">beküldve<i>, {{ o.serveransw }}</i><br> </span>
		</span>
		Azonosító: <b>{{ o._id }}</b> 
	</div>
  </div>
</template>

<script>
const server_adress="http://localhost:3000/"
export default {
	name: 'app',
	data: () => ({
    lista: [],
		euro_arf: 310,
		o: {
      pt: [ {} ],
      penznem: 'EUR'
		},
		saved: 'nincs',
		toload: '',
    mbd: false
	}),
	mounted() {
		let os, ov
		if ( (os = localStorage.getItem('o')) ) {
			ov = JSON.parse(os)
			if (ov.iskola) this.o=ov
		}
		setInterval(this.mentmind,5000)
	},
	computed: {
		reszfin() {
			return (Number(this.o.ito)*(1-Number(this.o.szazalek)/100)).toFixed(0)
		}
	},
	methods: {
    getlist() {
      this.axios
				.get( server_adress+"listall/" )
				.then( resp => {	
          this.lista=resp.data.data
          //console.log(this.lista)
				})
    },
		ust() {
			this.o.pt = this.o.pt.filter(v => v.pintnev )
		},
		mentmind() {
			let json = JSON.stringify(this.o)
			localStorage.setItem('o',json)
			this.saved=`helyi ${ (new Date()).toLocaleTimeString() }`
		},
		loadfromserver(id) {
			this.axios
				.get(server_adress + 'get/' + id )
				.then( resp => {	
          //console.log(resp.data)
					let answ = resp.data.data[0]
					this.saved = `loaded ${ (new Date()).toLocaleTimeString() }`
					if (answ) {		
						this.o = answ
						this.o._id = id
						this.o.serveransw = `betöltve ${ (new Date()).toLocaleTimeString() }`
					}
				})
		},
		menttoserver() {	
			this.mbd=true
			this.axios
				.post(`${ server_adress}ment/${this.o._id }`, this.o )
				.then( resp => {
					//console.log(resp.data)
					this.saved = `server ${ (new Date()).toLocaleTimeString() }`
					if (resp.data.newDoc) {
						this.o._id=resp.data.newDoc._id
						this.o.serveransw = `új rögzítve ${ (new Date()).toLocaleTimeString() }`
					} 
					else if (resp.data.uDoc) {
						let dt = new Date()
						this.o.serveransw = `módosítva ${ dt.toLocaleDateString() } ${ dt.toLocaleTimeString() }`
					}
					this.mbd=false	
				})
		},
		forint(value) {
			value=Number(value)
			var formatter = new Intl.NumberFormat('hu-HU', {
				style: 'currency',
				currency: 'HUF',
				minimumFractionDigits: 0
			})
			return formatter.format(value)
		},
		euro(value) {
			value=Number(value)
			var formatter = new Intl.NumberFormat('hu-HU', {
				style: 'currency',
				currency: 'EUR',
				minimumFractionDigits: 0
			})
			return formatter.format(value)
		}
	}
}
</script>

<style>
@media print {
	.onlyprint {
		display: block !important;
	}
    .no-print, .no-print * {
        display: none !important;
    }
}
.onlyprint {
	display: none;
}
body {
	margin:30px;
}
textarea {
	width:800px;
	height: 30px ;
}
#tb1 {
	width:99%;
	height: 200px ;
}
#ktn {
	width:300px;
}
.m20 {
	margin:5px;
	padding:5px;
	box-shadow:0px 0px 2px gray;
}
input, textarea, select, button {
	background-color: rgb(255, 255, 245);
	box-shadow: 0px 0px 1px gray;
	padding: 4px;
	font-size: 14px;
	border-radius: 4px;
}
.ir {
	text-align: right;
}
select {
	height: 28px;
	min-width: 250px;
}
.center {
	text-align: center;
}
td.negyed {
	width:25%;
}
</style>
