/*!BackgroundAPI.js
 * API for drawing background and switching between different modes
 * 
 * (c) 2018 Patrick Goldinger. All rights reserved.
 */


const BackgroundAPI = {
    FillColor: class {
        constructor (initOptions) {
            this.options = {
                color: "#333"
            }
            Object.assign(this.options, initOptions);
        }
        applyOn(element) {
            element.style.background = this.options.color;
        }
    },
    ImageAPI: Object.freeze({
        Position: Object.freeze({
            center: 1,
            corner: Object.freeze({
                bottomLeft: 5,
                bottomRight: 4,
                topLeft: 2,
                topRight: 3
            }),
            side: Object.freeze({
                bottom: 8,
                left: 9,
                right: 7,
                top: 6
            })
        }),
        Repeat: Object.freeze({
            norepeat: 1,
            repeat: 2,
            repeatX: 3,
            repeatY: 4,
            round: 5,
            space: 6
        }),
        Size: Object.freeze({
            contain: 1,
            cover: 2,
            originalSize: 3
        })
    }),
    Image: class {
        constructor (initOptions) {
            this.options = {
                baseColor: "rgb(0,0,0)",
                path: "file:///",
                position: BackgroundAPI.ImageAPI.Position.center,
                repeat: BackgroundAPI.ImageAPI.Repeat.norepeat,
                size: BackgroundAPI.ImageAPI.Size.cover
            }
            Object.assign(this.options, initOptions);
        }
        applyOn(element) {
            var pos = ["center center", "left top", "right top", "right bottom", "left bottom", "center top", "right center", "center bottom", "left center"],
                rep = ["no-repeat", "repeat", "repeat-x", "repeat-y", "round", "space"],
                siz = ["contain", "cover", "initial"];
            element.style.background = "url('" + this.options.path + "') " + this.options.baseColor;
            element.style.backgroundAttachment = "fixed";
            element.style.backgroundPosition = pos[this.options.position - 1];
            element.style.backgroundRepeat = rep[this.options.repeat - 1];
            element.style.backgroundSize = siz[this.options.size - 1];
        }
    },
    LinearGradient: class {
        constructor (initOptions) {
            this.options = {
                angle: 0,
                beginColor: "#000",
                endColor: "#fff"
            }
            Object.assign(this.options, initOptions);
        }
        applyOn(element) {
            element.style.background = "linear-gradient(" 
                + this.options.angle
                + "deg,"
                + this.options.beginColor
                + ","
                + this.options.endColor
                + ")";
        }
    },
    Mode: Object.freeze({
        fillColor: 1,
        linearGradient: 2,
        radialGradient: 3,
        image: 4
    }),
    RadialGradientAPI: Object.freeze({
        Position: Object.freeze({
            center: 1,
            corner: Object.freeze({
                bottomLeft: 5,
                bottomRight: 4,
                topLeft: 2,
                topRight: 3
            }),
            followMouse: 10,
            side: Object.freeze({
                bottom: 8,
                left: 9,
                right: 7,
                top: 6
            })
        }),
        Shape: Object.freeze({
            circle: 1,
            ellipse: 2
        })
    }),
    RadialGradient: class {
        constructor (initOptions) {
            this.options = {
                innerColor: "#000",
                outerColor: "#fff",
                position: BackgroundAPI.RadialGradientAPI.Position.center,
                shape: BackgroundAPI.RadialGradientAPI.Shape.circleq
            }
            Object.assign(this.options, initOptions);
        }
        applyOn(element) {
            var sh = ["circle", "ellipse"],
                po = ["center", "top left", "top right", "bottom right", "bottom left", "top", "right", "bottom", "left", "center"]
            var cssStr = "radial-gradient("
                + sh[this.options.shape - 1]
                + " at "
                + po[this.options.position - 1]
                + ","
                + this.options.innerColor
                + ","
                + this.options.outerColor
                + ")";
            element.style.background = cssStr;
        }
    }
}


class Background {

    constructor (initOptions, initObjects) {
        this.options = {
            element: null,
            linearGradient: null,
            image: null,
            mode: BackgroundAPI.Mode.fillColor,
            radialGradient: null
        }
        Object.assign(this.options, initOptions);
        this.fillColor = initObjects.fillColor;
        this.linearGradient = initObjects.linearGradient;
        this.radialGradient = initObjects.radialGradient;
        this.image = initObjects.image;

        var _this = this;

        window.addEventListener("mousemove", function (e) {
            var posx = 0, posy = 0;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY)    {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            var sha = ["circle", "ellipse"];
            if (_this.options.mode == BackgroundAPI.Mode.radialGradient
                && _this.radialGradient.options.position == BackgroundAPI.RadialGradientAPI.Position.followMouse) {
                var sh = ["circle", "ellipse"];
                var cssStr = "radial-gradient("
                    + sh[_this.radialGradient.options.shape - 1]
                    + " at "
                    + posx + "px " + posy + "px"
                    + ","
                    + _this.radialGradient.options.innerColor
                    + ","
                    + _this.radialGradient.options.outerColor
                    + ")";
                _this.options.element.style.background = cssStr;
            }
        });
    }

    refresh() {
        switch (this.options.mode) {
            case BackgroundAPI.Mode.fillColor:
                this.fillColor.applyOn(this.options.element);
                break;
            case BackgroundAPI.Mode.linearGradient:
                this.linearGradient.applyOn(this.options.element);
                break;
            case BackgroundAPI.Mode.radialGradient:
                this.radialGradient.applyOn(this.options.element);
                break;
            case BackgroundAPI.Mode.image:
                this.image.applyOn(this.options.element);
                break;
            default:
                document.write("Fatal error: unexpected code >" + this.options.mode + "< given.");
        }
    } 
}
