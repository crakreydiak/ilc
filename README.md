# General

Isomorphic Layout Composer (ILC) - layout service that compose a web page from fragment services.
It supports client/server based page composition.

It's key difference and advantage against other solutions lays in the fact that it does page composition isomorphically.
It means that page will be assembled at server side using apps that support server side rendering (SSR) and after that
it will be hydrated at client side so all further navigation will be handled by client side rendering.

Such approach allows to **combine advantages of the
[Micro Frontends](https://martinfowler.com/articles/micro-frontends.html),
[SPA](https://en.wikipedia.org/wiki/Single-page_application) &
[Server Side Rendering](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#server-rendering) approaches**.

## Why do I need ILC?

Microservices get a lot of traction these days. They allow multiple teams to work independently from each other, choose
their own technology stacks and establish their own release cycles. Unfortunately, frontend development hasn’t fully capitalized
yet on the benefits that microservices offer. The common practice for building websites remains “the monolith”: a single frontend
codebase that consumes multiple APIs.

What if we could have microservices on the frontend? This would allow frontend developers to work together with their backend
counterparts on the same feature and independently deploy parts of the website — “fragments” such as Header, Product, and Footer.
Bringing microservices to the frontend requires a layout service that composes a website out of fragments. ILC was developed to solve this need.

## Key features

* 📦 **Based on [single-spa](https://single-spa.js.org/) & [TailorX](https://github.com/StyleT/tailorx)** - battle tested solutions inside
* 📱 **Technology Agnostic** - use it with React, Vue.js, Angular, etc...
* ⚙️ **Server Side Rendering support** - key advantage over competitors
* 🗄 **Built-in registry** - add new apps, pages or change configs and templates in few clicks. [More info here](./docs/registry.md).
* ⚡️ **Built for speed** - server side part of the system adds just ~17ms of latency
* 👨‍💻 **Develop right at production** - [Doc](./docs/develop_at_production.md)
* 🌐 **Internationalization support** - it is ready to serve your clients from any country.
[Doc](./docs/i18n.md), [Demo with localized navbar](http://demo.microfrontends.online/ua/)
* 📡 **Other advanced features:**
    * [Parcels](./docs/parcels.md)
    * [Plugins](https://github.com/namecheap/ilc-plugins-sdk)
    * [App Wrappers](./docs/app_wrappers.md)
* 💲 **Backed by [Namecheap](https://www.namecheap.com/about/mission-vision-values/)** - we use it internally and plan to evolve it together with community

## 🚀 Quick start

1. Get familiar with [Installation guide](./docs/installation_guide.md)
1. Clone this repository
1. Run `docker-compose up -d`
1. _During first launch or shutdown only._ Run `docker-compose run registry npm run seed`
1. PROFIT 😎
    * View logs via `docker-compose logs -f --tail=10`
    * Open ILC at http://localhost:8233/
    * Open Registry UI at http://localhost:4001/ & use `root/pwd` credentials to sign in.
    * Shutdown everything with `docker-compose down`

## Further reading

* [Installation guide](./docs/installation_guide.md)
* [Micro-frontend Types](./docs/microfrontend-types.md)
* [Step-By-Step lessons about apps development with ILC](./docs/stepbystep/)
* [ILC to App interface](https://namecheap.github.io/ilc-sdk/pages/Pages/ilc_app_interface.html)
* [ILC Registry](./docs/registry.md)
* [Animation during reroute](./docs/animation_during_reroute.md)
* [Global error handling](./docs/global_errors_handling.md)
* [Demo applications used in quick start](https://github.com/namecheap/ilc-demo-apps)
* [SDK for ILC plugins development](https://github.com/namecheap/ilc-plugins-sdk)
* [Compatibility with legacy UMD bundles](./docs/umd_bundles_compatibility.md)
* [Global API](https://namecheap.github.io/ilc-sdk/pages/Pages/global_api.html)
* [ILC transition hooks](./docs/transition_hooks.md)
* [Multi-domains](./docs/multi-domains.md)
* [Public Path Problem](https://namecheap.github.io/ilc-sdk/pages/Pages/public_path.html)

## 🔌 Adapters
To conveniently connect various frameworks to ILC we rely on the [ecosystem of the single-spa](https://single-spa.js.org/docs/ecosystem)
provided adapters. However sometimes we need to extend original ones to deliver better integration with ILC.
Here are the list of the adapters that were forked & modified:

*  [React - ilc-adapter-react](https://github.com/namecheap/ilc-adapter-react)
*  [Vue.js - ilc-adapter-vue](https://github.com/namecheap/ilc-adapter-vue)
