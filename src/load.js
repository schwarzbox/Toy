// load.js
'use strict'

// GG.Loader.reset()

const LoadSystem = {
    images(list) {
        var urls = [];
        list.forEach((path) => {
            urls.push({
                name: path,
                url: path,
                onComplete: function () {},
                options: {crossOrigin: true}
            })
        })
        console.log("[Load images ...]");
        GG.Loader.onProgress.add((loader, resource) => {
            console.log(`[Loading -> ${resource.name}]`);
            console.log(`[Progress -> ${loader.progress}%]`);
        });

        // all sprite in loader.resources
        GG.Loader.add(urls);
    },
    sounds(list) {
        var urls = [];
        list.forEach((path) => {
            urls.push({
                name: path,
                url: path,
                onComplete: function () {},
                options: {crossOrigin: true}
            })
        })
        console.log("[Load sounds ...]");
        GG.Loader.onProgress.add((loader, resource) => {
            console.log(`[Loading -> ${resource.name}]`);
            console.log(`[Progress -> ${loader.progress}%]`);
        });

        // all sounds in loader.resources
        GG.Loader.add(urls).load(GG.init);
    },
    objects(list) {
        console.log("[Load objects ...]");
        list.forEach((path) => {
            import(`../${path}`).then(
                function(data){
                    console.log(`[Loading -> ${path}]`);
                    for (const cls in data) {
                        const tag = cls.toString();
                        console.log(`[Loading -> ${tag}]`);
                        GG.objects[tag] = data[cls];
                    }
                });
        })
    },
    scenes(list) {
        console.log("[Load scenes ...]");
        list.forEach((path) => {
            import(`../${path}`).then(
                function(data){
                    console.log(`[Loading -> ${path}]`);
                    for (const cls in data) {
                        const tag = cls.toString();
                        console.log(`[Loading -> ${tag}]`);
                        GG.scenes[tag] = new data[cls](tag);
                        GG.uis[tag] = new UI(tag);
                    }
                });
        })
    }
}

console.log('[Import -> LoadSystem]')
