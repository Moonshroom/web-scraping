const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const url = 'https://untappd.com/brewery/top_rated?country=poland';

	await page.goto(url);

	const breweries = await page.evaluate(() =>
		Array.from(document.querySelectorAll('div.beer-item')).map(
			(brewery) => ({
				name: brewery.querySelector('div.beer-details p.name')
					.innerText,
				logo: brewery.querySelector('a.label img').src,
				numOfBeers:
					brewery.querySelector('div.details p.abv').innerText,
				UntpdtNote: brewery.querySelector('div.rating span.num')
					.innerText,
				localizatiion: brewery.querySelector(
					'div.beer-item div.beer-details p.style'
				).innerText,
				type: brewery.querySelectorAll(
					'div.beer-item div.beer-details p.style'
				)[1].innerText,
			})
		)
	);

	await console.log(breweries);

	await browser.close();
})();
