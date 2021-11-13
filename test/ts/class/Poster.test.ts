import fetch from 'cross-fetch';
globalThis.fetch = fetch;
import { Poster } from '../../../src/ts/class/Poster';

customElements.define('wc-poster', Poster);

describe("class Poster", () => {
    test("custom elements in JSDOM", async () => {
        let wcposter: HTMLElement = document.createElement('wc-poster');
        {
            let ele = wcposter.shadowRoot!.querySelector<HTMLInputElement>('#request_method');
            expect(ele).not.toBeNull();
            if (ele) {
                ele.value = 'GET';
                ele.dispatchEvent(new Event('change'));
            }
        }
        {
            let ele = wcposter.shadowRoot!.querySelector<HTMLInputElement>('#request_url');
            expect(ele).not.toBeNull();
            if (ele) {
                ele.value = 'https://www.jma.go.jp/bosai/forecast/data/overview_forecast/130000.json';
            }
        }
        {
            let ele = wcposter.shadowRoot!.querySelector<HTMLInputElement>('#btn_query_params_add');
            expect(ele).not.toBeNull();
            if (ele) {
                ele.dispatchEvent(new Event('click'));
            }
        }
        {
            let ele = wcposter.shadowRoot!.querySelector<HTMLInputElement>('#list_query_params li [name="query_params_key"]');
            expect(ele).not.toBeNull();
            if (ele) {
                ele.value = 'key';
            }
        }
        {
            let ele = wcposter.shadowRoot!.querySelector<HTMLInputElement>('#list_query_params li [name="query_params_value"]');
            expect(ele).not.toBeNull();
            if (ele) {
                ele.value = 'value';
            }
        }
        {
            let ele = wcposter.shadowRoot!.querySelector<HTMLInputElement>('#btn_send');
            expect(ele).not.toBeNull();
            if (ele) {
                ele.dispatchEvent(new Event('click'));
            }
        }
    });

    test("ss", async () => {
        let wcposter: HTMLElement = document.createElement('wc-poster');
        if (wcposter instanceof Poster) {
            wcposter['ss'](1, n => n);
            wcposter['ss'](null, n => n);
        }
    });

    test("fetchUrl", async () => {
        let wcposter: HTMLElement = document.createElement('wc-poster');
        if (wcposter instanceof Poster) {
            {
                const ret = await wcposter['fetchUrl']('https://www.jma.go.jp/bosai/forecast/data/overview_forecast/130000.json', {});
            }
            {
                const ret = await wcposter['fetchUrl']('https://localhost:9876/', { method: "POST" });
            }
        }
    });
});
