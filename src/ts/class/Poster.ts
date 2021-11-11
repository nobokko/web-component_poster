//import "../template/Poster.html"

export class Poster extends HTMLElement {
    #shadowRoot: ShadowRoot;

    #s<T>(val: T | null, f: ((val: T) => any | void)) {
        if (val === null) {
            return;
        }

        return f(val);
    }

    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
        this.#shadowRoot.innerHTML = require("../template/Poster.html").default;

        this.#shadowRoot.querySelectorAll('#request_method,#request_url').forEach(ele => {
            ele.addEventListener('change', ev => {
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_info'), res_ele => {
                    res_ele.style.display = 'none';
                });
            });
        });

        this.#shadowRoot.querySelector('#btn_send')?.addEventListener('click', ev => {
            let url: string = this.#shadowRoot.querySelector<HTMLInputElement>('#request_url')?.value ?? '';

            let init_method: { method?: string } = {};
            this.#shadowRoot.querySelectorAll<HTMLInputElement>('#request_method').forEach(ele => {
                if (ele.value) {
                    init_method['method'] = ele.value;
                }
            });

            let init = { ...init_method };

            fetch(url, init).then(response => {
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_type'), res_ele => {
                    res_ele.innerText = response.type;
                });
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_status'), res_ele => {
                    res_ele.innerText = response.statusText;
                });
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_headers'), res_ele => {
                    res_ele.innerHTML = '';
                    response.headers.forEach((header, key) => {
                        let d = document.createElement('div');
                        d.innerText = key + ': ' + header;
                        res_ele.appendChild(d);
                    });
                });

                return response.text();
            }).then(text => {
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_text'), res_ele => {
                    res_ele.innerText = text;
                });
            }).catch((reason) => {
                //エラー
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_type'), res_ele => {
                    res_ele.innerText = '';
                });
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_status'), res_ele => {
                    res_ele.innerText = '' + reason;
                });
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_headers'), res_ele => {
                    res_ele.innerHTML = '';
                });
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_text'), res_ele => {
                    res_ele.innerText = '' + reason;
                });
            }).finally(() => {
                this.#s(this.#shadowRoot?.querySelector<HTMLElement>('#response_info'), res_ele => {
                    res_ele.style.display = '';
                });
            });
        })

        this.#shadowRoot.querySelector('#btn_query_params_add')?.addEventListener('click', ev => {
            let template: string = this.#shadowRoot.querySelector<HTMLElement>('#template_query_params_add')?.innerHTML ?? '';
            this.#shadowRoot.querySelectorAll<HTMLElement>('#list_query_params').forEach(list_ele => {
                let li = document.createElement('li');
                li.innerHTML = template;
                list_ele.appendChild(li);
            });

        })
    }
}