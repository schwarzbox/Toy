// events.js
'use strict'

GG.app.renderer.plugins.interaction.moveWhenInside = true;
GG.app.renderer.plugins.interaction.autoPreventDefault = true;


const Events = {
    interaction: GG.app.renderer.plugins.interaction,
    window: {
        "resize": {"name":null, "func":[]},
        "drop": {"name":null, "func":[]},
        "drag": {"name":null, "func":[]},
        "dragstart": {"name":null, "func":[]},
        "dragend": {"name":null, "func":[]},
        "dragover": {"name":null, "func":[]},
        "dragleave": {"name":null, "func":[]},
        "dragenter": {"name":null, "func":[]},
        "keydown": {"name":null, "func":[]},
        "keyup": {"name":null, "func":[]},
        "click": {"name":null, "func":[]},
        "dblclick": {"name":null, "func":[]},
        "mousedown": {"name":null, "func":[]},
        "mouseup": {"name":null, "func":[]},
        "mousewheel": {"name":null, "func":[]},
        "mousemove": {"name":null, "func":[]},
        "mouseover": {"name":null, "func":[]},
        "mouseout": {"name":null, "func":[]},
        "mouseenter": {"name":null, "func":[]},
        "mouseleave": {"name":null, "func":[]}
    },
    mouseLocal: function(object) {
        const mouse = object.toLocal(this.interaction.mouse.global);
        return new Vector(mouse.x, mouse.y);
    },
    mouseGlobal: function() {
        return new Vector(
            this.interaction.mouse.global.x,
            this.interaction.mouse.global.y
        );
    },
    addWindowEvent: function (event, func) {
        this.window[event]["name"] = event
        this.window[event]["func"].push(func)
        window.addEventListener(event, func)
    },
    addSceneEvent: function(object, event, func) {
        object.container.on(event, func);
    },
    addObjectEvent: function(object, event, func) {
        object.body.on(event, func);
    },
    removeWindowEvent: function(event) {
        if (this.window[event]["name"]) {
            this.window[event]["func"].forEach((ev) => {
                window.removeEventListener(
                    this.window[event]["name"], ev
                );
            });
        }
    },
    removeWindowEvents() {
        for (event in this.window) {
            this.removeWindowEvent(event);
        }
    },
    removeEvent: function(body) {
        body.removeAllListeners();
    },
    removeAll: function (scene, objects) {
        this.removeWindowEvents()

        objects.forEach((obj) => {
            this.removeEvent(obj.body)
        });
        this.removeEvent(scene.container)
    }
}

console.log('[Import -> Events]')
