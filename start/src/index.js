//1
// campi del form
// risultati

//6
//chiamata API

//5
//imposta la chiave api e la regione per l'utente

//4
// gestisce l'invio del form

//3 controlli iniziali

//2
// imposta i listeners e la partenza dell'app

// フォームフィールド
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

// 結果
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

form.addEventListener('submit', (e) => handleSubmit(e));
// form.addEventListener('submit', function(e){return handleSubmit(e)});
clearBtn.addEventListener('click', (e) => reset(e));
init();

function init() {
	//何かがローカルストレージにある場合は、それをピックアップします。
	const storedApiKey = localStorage.getItem('apiKey');
	const storedRegion = localStorage.getItem('regionName');

	//アイコンを一般的な緑色に設定
	//todo

	if (storedApiKey === null || storedRegion === null) {
		//キーを持っていない場合は、フォームを表示します。
		form.style.display = 'block';
		results.style.display = 'none';
		loading.style.display = 'none';
		clearBtn.style.display = 'none';
		errors.textContent = '';
	} else {
        //ローカルストレージにキー/領域を保存している場合、そのキー/領域がロードされたときに結果を表示します。
        displayCarbonUsage(storedApiKey, storedRegion);
		results.style.display = 'none';
		form.style.display = 'none';
		clearBtn.style.display = 'block';
	}
};

function handleSubmit(e) {
	e.preventDefault();
	setUpUser(apiKey.value, region.value);
}

function reset(e) {
	e.preventDefault();
	//リージョン専用のローカルストレージをクリアします。
	localStorage.removeItem('regionName');
	init();
}

function setUpUser(apiKey, regionName) {
	localStorage.setItem('apiKey', apiKey);
	localStorage.setItem('regionName', regionName);
	loading.style.display = 'block';
	errors.textContent = '';
	clearBtn.style.display = 'block';
	//初期化の呼び出し
	displayCarbonUsage(apiKey, regionName);
}

import axios from '../node_modules/axios';

async function displayCarbonUsage(apiKey, region) {
	try {
		await axios
			.get('https://api.co2signal.com/v1/latest', {
				params: {
					countryCode: region,
				},
				headers: {
					'auth-token': apiKey,
				},
			})
			.then((response) => {
				let CO2 = Math.floor(response.data.data.carbonIntensity);

				//calculateColor(CO2);

				loading.style.display = 'none';
				form.style.display = 'none';
				myregion.textContent = region;
				usage.textContent =
					Math.round(response.data.data.carbonIntensity) + ' grams (grams C02 emitted per kilowatt hour)';
				fossilfuel.textContent =
					response.data.data.fossilFuelPercentage.toFixed(2) +
					'% (percentage of fossil fuels used to generate electricity)';
				results.style.display = 'block';
			});
	} catch (error) {
		console.log(error);
		loading.style.display = 'none';
		results.style.display = 'none';
		errors.textContent = 'Sorry, we have no data for the region you have requested.';
	}
}
