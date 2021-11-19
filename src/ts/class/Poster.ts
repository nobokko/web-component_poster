//import "../template/Poster.html"

export class Poster extends HTMLElement {
    #shadowRoot: ShadowRoot;

    private ss<T>(val: T | null, f: ((val: T) => any | void)) {
        if (val === null) {
            return;
        }

        return f(val);
    }

    private get template() {
        let template = require("../template/Poster.html");
        if (typeof template !== 'string') {
            template = template.default;
        }

        return template;
    }

    private fetchUrl(url: string, init: RequestInit) {
        return fetch(url, init).then(response => {
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_type'), res_ele => {
                res_ele.innerText = response.type;
            });
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_status'), res_ele => {
                res_ele.innerText = response.statusText;
            });
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_headers'), res_ele => {
                res_ele.innerHTML = '';
                response.headers.forEach((header, key) => {
                    let d = document.createElement('div');
                    d.innerText = key + ': ' + header;
                    res_ele.appendChild(d);
                });
            });

            return response.text();
        }).then(text => {
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_text'), res_ele => {
                res_ele.innerText = text;
            });

            return text;
        }).catch((reason) => {
            //エラー
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_type'), res_ele => {
                res_ele.innerText = '';
            });
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_status'), res_ele => {
                res_ele.innerText = '' + reason;
            });
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_headers'), res_ele => {
                res_ele.innerHTML = '';
            });
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_text'), res_ele => {
                res_ele.innerText = '' + reason;
            });
        }).finally(() => {
            this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_info'), res_ele => {
                res_ele.style.display = '';
            });
        });
    }

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
        this.#shadowRoot.innerHTML = this.template;

        this.#shadowRoot.querySelectorAll('#request_method,#request_url').forEach(ele => {
            ele.addEventListener('change', ev => {
                this.ss(this.#shadowRoot.querySelector<HTMLElement>('#response_info'), res_ele => {
                    res_ele.style.display = 'none';
                });
            });
        });

        this.#shadowRoot.querySelector('#btn_send')!.addEventListener('click', ev => {
            let url: string = this.#shadowRoot.querySelector<HTMLInputElement>('#request_url')!.value;

            let init_method: { method?: string } = {};
            this.#shadowRoot.querySelectorAll<HTMLInputElement>('#request_method').forEach(ele => {
                if (ele.value) {
                    init_method['method'] = ele.value;
                }
            });
            let init_body: { body?: FormData | string } = {};
            let formData: FormData | null = null;
            this.#shadowRoot.querySelectorAll<HTMLElement>('#list_query_params li').forEach(ele => {
                let key = ele.querySelector<HTMLInputElement>('[name="query_params_key"]');
                if (key && key.value) {
                    let val = ele.querySelector<HTMLInputElement>('[name="query_params_value"]');
                    if (val) {
                        if (formData == null) {
                            formData = new FormData();
                        }
                        formData.append(key.value, val.value);
                    }
                }
            });
            if (formData) {
                // init_body['body'] = JSON.stringify([...(formData as FormData).entries()].reduce((obj: {[key: string]: any}, val)=>{obj[val[0]] = val[1];return obj;}, {}));
                init_body['body'] = formData;
            }

            let init = {
                ...init_method,
                ...init_body,
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                    // 'Content-Type': 'application/json',
                    // 'Content-Type': 'multipart/form-data', // Boundary
                    // 'Content-Type': 'application/octet-stream',
                    // 'Content-Type': 'image/png',
                }
            };

            this.fetchUrl(url, init);
        })

        this.#shadowRoot.querySelector('#btn_query_params_add')!.addEventListener('click', ev => {
            let template: string = this.#shadowRoot.querySelector<HTMLElement>('#template_query_params_add')!.innerHTML;
            this.#shadowRoot.querySelectorAll<HTMLElement>('#list_query_params').forEach(list_ele => {
                let li = document.createElement('li');
                li.innerHTML = template;
                list_ele.appendChild(li);
            });

        })
    }
}