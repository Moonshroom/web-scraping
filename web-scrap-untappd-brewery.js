const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	//link to list of breweires on untappd website
	const URL = 'https://untappd.com/brewery/top_rated?country=poland';

	await page.goto(URL);

	//scrap links to separate breweries
	const breweries = await page.evaluate(() =>
		Array.from(document.querySelectorAll('div.beer-item')).map(
			(brewery) => brewery.querySelector('div.beer-details p.name a').href
		)
	);
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
				id: Math.random().toString(36).substr(2, 9),
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
			'passed',
			i + 1,
			'out of',
			breweries.length,
			'     ',
			i * 2,
			'/',
			breweries.length * 2,
			'%'
		);
		//add sraped data to the dataset
		data.push(newItem);
	}
	console.log(data);
	await browser.close();
})();
