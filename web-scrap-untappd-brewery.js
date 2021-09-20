const { createDiffieHellman } = require('crypto');
const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	const URL = 'https://untappd.com/brewery/top_rated?country=poland';

	await page.goto(URL);

	const breweries = await page.evaluate(() =>
		Array.from(document.querySelectorAll('div.beer-item')).map(
			(brewery) => brewery.querySelector('div.beer-details p.name a').href
		)
	);

	// breweries.map((b) => console.log(b));
	const data = [];

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
						: 'brak',

				fb:
					d.querySelector(' div.bottom div.actions a.fb') !== null
						? d.querySelector(' div.bottom div.actions a.fb').href
						: 'brak',

				ig:
					d.querySelector(' div.bottom div.actions a.ig') !== null
						? d.querySelector(' div.bottom div.actions a.ig').href
						: 'brak',
				tw:
					d.querySelector(' div.bottom div.actions a.tw') !== null
						? d.querySelector(' div.bottom div.actions a.tw').href
						: 'brak',
			}))
		);
		console.log('passed', i + 1, 'out of', breweries.length);
		data.push(newItem);
		// await page.close();
	}

	console.log(data);

	// for (i = 0; i <= 2; i++) {
	// 	await page.goto(breweries[i], {
	// 		waitUntil: 'networkidle2',
	// 	});
	// 	await page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
	// 	await page.evaluate(() => console.log(`url is ${location.href}`));
	// }

	await browser.close();
	// console.log(`"${breweries[1]}"`);
})();
