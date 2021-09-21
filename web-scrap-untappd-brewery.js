const puppeteer = require('puppeteer');

(async () => {
	console.log('Run headless browser...');
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	//link to list of breweires on untappd website
	console.log('Finding url...');
	const URL = 'https://untappd.com/brewery/top_rated?country=poland';

	await page.goto(URL);
	console.log('Collecting links...');
	//scrap links to separate breweries
	const breweries = await page.evaluate(() =>
		Array.from(document.querySelectorAll('div.beer-item')).map(
			(brewery) => brewery.querySelector('div.beer-details p.name a').href
		)
	);
	console.log('Preparing elements to scraping process...');
	// console.log all links
	// breweries.map((b) => console.log(b));

	//dataholding variable
	const data = [];

	//loop around links and scrapp data
	for (let i = 0; i <= breweries.length - 1; i++) {
		await page.goto(breweries[i], {
			waitUntil: 'networkidle2',
		});
		const newItem = await page.evaluate(() =>
			Array.from(document.querySelectorAll('div.cont')).map((d) => ({
				key: Math.random().toString(36).substr(2, 9),
				scrapFrom: 'untappd',
				name: d.querySelector(' div.top div.basic div.name h1')
					.innerText,
				localization: d.querySelector(
					' div.top div.basic div.name p.brewery'
				).innerText,
				type: d.querySelector(' div.top div.basic div.name p.style')
					.innerText,
				logo: d.querySelector('  div.top div.basic a.label img').src,
				numOfBeers: d.querySelector(' div.details p.count').innerText,
				utpRaiting: d.querySelector(' div.details span.num').innerText,
				description: d.querySelector(
					' div.bottom div.desc  div.beer-descrption-read-less'
				).innerText,
				website:
					d.querySelector(' div.bottom div.actions a.url') !== null
						? d.querySelector(' div.bottom div.actions a.url').href
						: 'no data',

				fb:
					d.querySelector(' div.bottom div.actions a.fb') !== null
						? d.querySelector(' div.bottom div.actions a.fb').href
						: 'no data',

				ig:
					d.querySelector(' div.bottom div.actions a.ig') !== null
						? d.querySelector(' div.bottom div.actions a.ig').href
						: 'no data',
				tw:
					d.querySelector(' div.bottom div.actions a.tw') !== null
						? d.querySelector(' div.bottom div.actions a.tw').href
						: 'no data',
			}))
		);

		//check on progress
		console.log(
			'Elements passed:',
			i + 1,
			'out of',
			breweries.length,
			' | ',
			'Progress:',
			((parseInt(i) / parseInt(breweries.length - 1)) * 100).toFixed(1),
			'/',
			100,
			'%'
		);
		//add scraped data to the dataset
		data.push(newItem);
	}
	console.log('Data successfully collected.');
	setTimeout(function () {
		console.log(data);
	}, 3000);

	// data.map((brewery) => console.log(brewery));
	await browser.close();
})();
